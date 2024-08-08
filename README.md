![Vercel](https://vercelbadge.vercel.app/api/GesangPJ/GTRetail?style=for-the-badge)

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.

# GT-RETAIL

Aplikasi Sistem Manajemen Penjualan untuk UMKM berbasis Node.JS dengan framework Next.JS 14.2

## Fitur Website

1. Next.JS App Router.
2. Next-Auth untuk Autentikasi.
3. Json Web Token (JWT).
4. MUI DataGrid untuk penyajian data lebih baik.
5. Multi-Role account, akun terbagi menjadi 2 tipe : Admin dan Karyawan.
6. Bcrypt untuk password hashing.
7. API Protection menggunakan JWT Token Validation.
8. Pages protection menggunakan session.
9. Admin Master Key autentikasi bagi admin untuk mengganti password akun dan data akun.

## Fitur Sistem Penjualan

1. Transaksi Penjualan : Tambah Transaksi, daftar transaksi, edit status transaksi.
2. Detail Transaksi
3. Produk : Tambah Produk, Daftar Produk, Edit Produk.
4. Kategori Produk : Tambah Kategori Produk, edit status kategori produk.
5. Pembelian / Purchasing : Tambah Pembelian, edit pembelian.
6. Detail Pembelian
7. Stok : Atur Stok Produk.
8. Pelanggan : Tambah pelanggan, daftar pelanggan, edit pelanggan.
9. Distributor : Tambah Distributor, daftar distributor, edit distributor.
10. Akun : Akun Admin & Karyawan : Tambah Akun, Edit Akun.

## Changelog

### v1.1.7

- Fix Bug Tambah Produk, dimana kategoriId berisi Null.
- Membuat Jurnal Transaksi.
- Membuat Jurnal Pembelian.
- Fungsi Jurnal Sementara.
- Ganti Prisma connection menggunakan `DATABASE_URL`.

### v1.0.0

Rilis pertama.

- Fitur Mesin Kasir (Tambah Transaksi) sudah berfungsi.
- Daftar Transaksi.
- Detail Transaksi.
- Produk (Daftar, Tambah, Edit).
- Kategori Produk (Daftar, Tambah).
- Pelanggan (Daftar, Tambah, Edit).
- Akun (Admin & Karyawan, Tambah + Edit).
- Pembelian (Tambah, Daftar, Edit)
- Distributor (Daftar, Tambah, Edit).
