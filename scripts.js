/* App JS - uses jQuery */
const PRODUCTS = [
    { id: 1, name: "Guitar acoustic Yamaha F310", short: "Guitar acoustic cho người mới tập", long: "Guitar acoustic Yamaha F310 - âm sắc ấm, dễ chơi.", price: 3200000, stock: 10, image: "../img/guitar1.jpg" },
    { id: 2, name: "Guitar điện Fender Squier", short: "Guitar điện giá rẻ", long: "Fender Squier - phù hợp tập luyện.", price: 5600000, stock: 5, image: "../img/guitar2.jpg" },
    { id: 3, name: "Đàn piano điện Casio 88 phím", short: "Piano điện 88 phím", long: "Casio 88 phím, nhiều chức năng.", price: 14500000, stock: 2, image: "../img/piano1.jpg" },
    { id: 4, name: "Ukulele Concert Kala", short: "Ukulele nhỏ gọn", long: "Ukulele Kala - âm sáng và dễ cầm.", price: 900000, stock: 15, image: "../img/ukulele1.jpg" },
    { id: 5, name: "Violin 4/4 Hofner", short: "Violin full-size", long: "Violin Hofner 4/4 - âm thanh rõ.", price: 4200000, stock: 6, image: "../img/violin1.jpg" },
    { id: 6, name: "Trống cajon Latin Percussion", short: "Trống cajon gỗ", long: "Cajon - âm trầm ấm, thân gỗ chắc.", price: 2200000, stock: 8, image: "../img/cajon1.jpg" },
    { id: 7, name: "Saxophone Alto Yamaha", short: "Saxophone alto", long: "Sax alto Yamaha - chất lượng tốt.", price: 8500000, stock: 3, image: "../img/sax1.jpg" },
    { id: 8, name: "Trống set trẻ em 5 món", short: "Bộ trống mini", long: "Bộ trống 5 món dành cho trẻ.", price: 1500000, stock: 20, image: "../img/drum1.jpg" },
    { id: 9, name: "Keyboard Yamaha PSR-EW310", short: "Keyboard 76 phím", long: "Yamaha PSR-EW310 - chức năng luyện tập.", price: 4200000, stock: 7, image: "../img/keyboard1.jpg" },
    { id: 10, name: "Bộ micro thu âm XLR", short: "Micro thu âm studio", long: "Micro XLR chuyên nghiệp cho thu âm.", price: 1800000, stock: 12, image: "../img/mic1.jpg" }
];

function cartGet() { return JSON.parse(localStorage.getItem('nc_cart') || '[]'); }

function cartSet(c) { localStorage.setItem('nc_cart', JSON.stringify(c));
    updateCartCount(); }

function addToCart(id, qty = 1) { let c = cartGet(); const ix = c.findIndex(i => i.id == id); if (ix > -1) c[ix].qty += qty;
    else c.push({ id, qty });
    cartSet(c);
    showModal('Đã thêm vào giỏ hàng'); }

function removeFromCart(id) { let c = cartGet().filter(i => i.id != id);
    cartSet(c);
    renderCart(); }

function updateCartCount() { const count = cartGet().reduce((s, i) => s + i.qty, 0);
    $('.cart-count').text(count); }

function renderPreview() {
    const el = $('#preview-list');
    if (!el.length) return;
    const top = PRODUCTS.slice(0, 6);
    el.empty();
    top.forEach(p => {
        const card = $('<div class="col-md-4"><div class="card mb-3"><img class="card-img-top" src="' + p.image + '" alt="' + p.name + '"><div class="card-body"><h5>' + p.name + '</h5><p>' + p.short + '</p><p><strong>' + p.price.toLocaleString() + '₫</strong></p><a href="product-detail.html?id=' + p.id + '" class="btn btn-primary">Xem chi tiết</a></div></div></div>');
        el.append(card);
    });
}

function renderProductList(filter = '') {
    const el = $('#product-list');
    if (!el.length) return;
    el.empty();
    PRODUCTS.filter(p => (p.name + ' ' + p.short).toLowerCase().includes(filter.toLowerCase())).forEach(p => {
        const card = $('<div class="col-md-4"><div class="card mb-3"><img class="card-img-top" src="' + p.image + '" alt="' + p.name + '"><div class="card-body"><h5>' + p.name + '</h5><p>' + p.short + '</p><p><strong>' + p.price.toLocaleString() + '₫</strong></p><button class="btn btn-success add-btn" data-id="' + p.id + '">Thêm vào giỏ</button> <a href="product-detail.html?id=' + p.id + '" class="btn btn-outline-secondary">Chi tiết</a></div></div></div>');
        el.append(card);
    });
    $('.add-btn').on('click', function() { addToCart(Number($(this).data('id'))); });
}

function renderProductDetail() {
    const el = $('#product-detail');
    if (!el.length) return;
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id') || 1);
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) { el.html('<p>Sản phẩm không tìm thấy</p>'); return; }
    el.html('<div class="row"><div class="col-md-6"><img class="img-fluid" src="' + p.image + '" alt="' + p.name + '"></div><div class="col-md-6"><h2>' + p.name + '</h2><p>' + p.long + '</p><p><strong>Giá: ' + p.price.toLocaleString() + '₫</strong></p><p>Kho: ' + p.stock + '</p><p><button id="add-to-cart" class="btn btn-primary">Thêm vào giỏ</button></p></div></div>');
    $('#add-to-cart').on('click', () => { addToCart(p.id); });
}

function renderCart() {
    const el = $('#cart-contents');
    if (!el.length) return;
    const cart = cartGet();
    if (cart.length === 0) { el.html('<p>Giỏ hàng rỗng</p>');
        $('#checkout-area').html(''); return; }
    let html = '';
    let total = 0;
    cart.forEach(item => { const p = PRODUCTS.find(x => x.id === item.id);
        total += p.price * item.qty;
        html += '<div class="card mb-2 p-2"><h5>' + p.name + '</h5><p>Giá: ' + p.price.toLocaleString() + '₫ x ' + item.qty + ' = ' + (p.price * item.qty).toLocaleString() + '₫</p><button class="btn btn-sm btn-danger remove-item" data-id="' + p.id + '">Xóa</button></div>'; });
    el.html(html);
    $('#checkout-area').html('<div class="card p-3"><h4>Tổng: ' + total.toLocaleString() + '₫</h4><a href="checkout.html" class="btn btn-primary">Tiến hành thanh toán</a></div>');
    $('.remove-item').on('click', function() { removeFromCart(Number($(this).data('id'))); });
}

function handleRegister() {
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        const fullname = $('#fullname').val().trim();
        const email = $('#email').val().trim();
        const phone = $('#phone').val().trim();
        const pw = $('#password').val();
        const pw2 = $('#password2').val();
        if (fullname.split(' ').length < 2) { showModal('Họ tên phải gồm ít nhất 2 từ'); return; }
        if (!/^[0-9]{9,11}$/.test(phone)) { showModal('Số điện thoại chưa đúng (9-11 chữ số)'); return; }
        if (pw.length < 6) { showModal('Mật khẩu phải ít nhất 6 ký tự'); return; }
        if (pw !== pw2) { showModal('Mật khẩu không khớp'); return; }
        let users = JSON.parse(localStorage.getItem('nc_users') || '[]');
        if (users.some(u => u.email === email)) { showModal('Email đã được sử dụng'); return; }
        users.push({ fullname, email, phone, password: pw });
        localStorage.setItem('nc_users', JSON.stringify(users));
        showModal('Đăng ký thành công!');
        $(this)[0].reset();
    });
}

function handleLogin() {
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        const email = $('#login-email').val().trim();
        const pw = $('#login-password').val();
        const users = JSON.parse(localStorage.getItem('nc_users') || '[]');
        const u = users.find(x => x.email === email && x.password === pw);
        if (!u) { showModal('Sai email hoặc mật khẩu'); return; }
        localStorage.setItem('nc_logged', JSON.stringify(u));
        showModal('Đăng nhập thành công!');
        setTimeout(() => { location.href = 'index.html'; }, 800);
    });
}

function renderAccount() {
    const el = $('#account-info');
    if (!el.length) return;
    const u = JSON.parse(localStorage.getItem('nc_logged') || 'null');
    if (!u) { el.html('<p>Chưa đăng nhập. Vui lòng <a href="login.html">đăng nhập</a> hoặc <a href="register.html">đăng ký</a>.</p>'); return; }
    el.html('<div class="card p-3"><h4>' + u.fullname + '</h4><p>Email: ' + u.email + '</p><p>Phone: ' + u.phone + '</p><button id="logout" class="btn btn-secondary">Đăng xuất</button></div>');
    $('#logout').on('click', () => { localStorage.removeItem('nc_logged');
        location.reload(); });
}

function handleCheckout() {
    $('#checkoutForm').on('submit', function(e) {
        e.preventDefault();
        const name = $('#ship-name').val().trim();
        const addr = $('#ship-addr').val().trim();
        if (!name || !addr) { showModal('Vui lòng nhập tên và địa chỉ'); return; }
        const orders = JSON.parse(localStorage.getItem('nc_orders') || '[]');
        orders.push({ id: Date.now(), name, addr, cart: cartGet(), date: new Date().toISOString() });
        localStorage.setItem('nc_orders', JSON.stringify(orders));
        localStorage.removeItem('nc_cart');
        showModal('Đặt hàng thành công (mô phỏng)');
        setTimeout(() => { location.href = 'order-success.html'; }, 800);
    });
}

function showModal(text) {
    document.querySelector('#siteModal .modal-body').textContent = text;
    var modal = new bootstrap.Modal(document.getElementById('siteModal'));
    modal.show();
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    if (document.getElementById('preview-list')) renderPreview();
    if (document.getElementById('product-list')) renderProductList('');
    if (document.getElementById('product-detail')) renderProductDetail();
    if (document.getElementById('cart-contents')) renderCart();
    if (document.getElementById('registerForm')) handleRegister();
    if (document.getElementById('loginForm')) handleLogin();
    if (document.getElementById('account-info')) renderAccount();
    if (document.getElementById('checkoutForm')) handleCheckout();

    var searchForm = document.getElementById('searchForm');
    if (searchForm) searchForm.addEventListener('submit', function(e) { e.preventDefault(); var q = document.getElementById('q').value.trim(); if (!q) return;
        localStorage.setItem('nc_search', q);
        location.href = 'products.html'; });
});