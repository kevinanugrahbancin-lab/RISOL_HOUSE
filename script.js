
// ==================================
// 1. DATA PRODUK RISOL HOUSE
// ==================================

const products = [
    {
        id: 1,
        name: "Risol Mayo",
        price: 3000,
        image: "risol-mayo.jpeg",
        description: "Risol renyah dengan isian mayo yang creamy dan lezat."
    },
    {
        id: 2,
        name: "Risol Ayam Suwir",
        price: 3000,
        image: "risol-ayam.jpeg",
        description: "Risol gurih dengan isian ayam suwir yang nikmat."
    },
    {
        id: 3,
        name: "Risol Cokelat",
        price: 3000,
        image: "risol-cokelat.jpeg",
        description: "Risol renyah dengan isian cokelat manis."
    }
];

// Nomor WhatsApp Risol House
const nomorWA = "628217973219";

// Keranjang belanja
let cart = [];


// ==================================
// 2. FORMAT HARGA RUPIAH
// ==================================

function formatRupiah(angka) {
    return "Rp" + angka.toLocaleString("id-ID");
}


// ==================================
// 3. MENAMPILKAN PRODUK
// ==================================

const productList = document.getElementById("productList");

function tampilkanProduk(data) {

    productList.innerHTML = "";

    if (data.length === 0) {
        productList.innerHTML =
            '<p class="empty">Produk tidak ditemukan.</p>';
        return;
    }

    data.forEach(produk => {

        productList.innerHTML += `
            <div class="product">

                <img
                    src="${produk.image}"
                    alt="${produk.name}"
                >

                <div class="product-info">

                    <h3>${produk.name}</h3>

                    <p class="price">
                        ${formatRupiah(produk.price)}
                    </p>

                    <p class="description">
                        ${produk.description}
                    </p>

                    <button
                        class="add-btn"
                        data-id="${produk.id}"
                    >
                        + Tambahkan ke Pesanan
                    </button>

                </div>
            </div>
        `;
    });
}


// ==================================
// 4. PENCARIAN PRODUK
// ==================================

document.getElementById("search")
    .addEventListener("input", function() {

        const keyword = this.value.toLowerCase();

        const hasil = products.filter(produk =>
            produk.name.toLowerCase().includes(keyword)
        );

        tampilkanProduk(hasil);
    });


// ==================================
// 5. MENAMBAHKAN PRODUK KE KERANJANG
// ==================================

productList.addEventListener("click", function(event) {

    const button = event.target.closest(".add-btn");

    if (!button) return;

    const id = Number(button.dataset.id);

    const produk = products.find(item => item.id === id);

    if (!produk) return;

    const itemCart = cart.find(item => item.id === id);

    if (itemCart) {
        itemCart.quantity++;
    } else {
        cart.push({
            ...produk,
            quantity: 1
        });
    }

    tampilkanKeranjang();
});


// ==================================
// 6. MENAMPILKAN KERANJANG
// ==================================

const cartList = document.getElementById("cartList");

function tampilkanKeranjang() {

    cartList.innerHTML = "";

    if (cart.length === 0) {

        cartList.innerHTML =
            '<p class="empty">Keranjang masih kosong.</p>';

    }

    cart.forEach(item => {

        cartList.innerHTML += `
            <div class="cart-item">

                <div>
                    <h4>${item.name}</h4>

                    <p>
                        ${formatRupiah(item.price)} x ${item.quantity}
                    </p>
                </div>

                <div class="quantity">

                    <button
                        data-action="minus"
                        data-id="${item.id}"
                    >-</button>

                    <strong>${item.quantity}</strong>

                    <button
                        data-action="plus"
                        data-id="${item.id}"
                    >+</button>

                    <button
                        class="remove-btn"
                        data-action="remove"
                        data-id="${item.id}"
                    >Hapus</button>

                </div>

            </div>
        `;
    });

    hitungTotal();
}


// ==================================
// 7. MENGATUR JUMLAH PESANAN
// ==================================

cartList.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const id = Number(button.dataset.id);

    const action = button.dataset.action;

    const item = cart.find(item => item.id === id);

    if (!item) return;

    if (action === "plus") {
        item.quantity++;
    }

    if (action === "minus") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
    }

    if (action === "remove") {
        cart = cart.filter(item => item.id !== id);
    }

    tampilkanKeranjang();
});


// ==================================
// 8. MENGHITUNG TOTAL HARGA
// ==================================

function hitungTotal() {

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    document.getElementById("totalPrice").textContent =
        formatRupiah(total);

    document.getElementById("checkoutBtn").disabled =
        cart.length === 0;

}


// ==================================
// 9. CHECKOUT WHATSAPP
// ==================================

document.getElementById("checkoutBtn")
    .addEventListener("click", function() {

        if (cart.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }

        let pesan = "Halo Risol House! Saya ingin memesan:\n\n";

        cart.forEach(item => {

            pesan +=
                item.name +
                "\nJumlah: " + item.quantity +
                " buah\nSubtotal: " +
                formatRupiah(item.price * item.quantity) +
                "\n\n";

        });

        const total = cart.reduce(
            (jumlah, item) =>
                jumlah + item.price * item.quantity,
            0
        );

        pesan +=
            "Total Pesanan: " +
            formatRupiah(total);

        pesan += "\n\nTerima kasih!";

        const url =
            "https://wa.me/" +
            nomorWA +
            "?text=" +
            encodeURIComponent(pesan);

        window.open(url, "_blank");

    });


// ==================================
// 10. MENJALANKAN WEBSITE
// ==================================

tampilkanProduk(products);

tampilkanKeranjang();
