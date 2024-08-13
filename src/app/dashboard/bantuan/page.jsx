
import { Typography } from "@mui/material"
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

const HalamanBantuan = () =>{

  return(
    <div>
      <div className=" justify-center items-center ">
        <Box sx={{ width: '100%'}} >
          <Typography variant="h2" sx={{fontWeight:'bold'}}>
            Halaman Bantuan
          </Typography>
          <Divider/>
          <br />
          <Typography variant="h3">
            A. Membuat Transaksi
          </Typography><br />
          <div className="ml-[22px] pl-[22px] text-xl">
            <ol type="number">
              <li>Buka Dashboard dengan klik <code>DASHBOARD</code> di sidebar</li>
              <li>Pilih / Ketik nama pelanggan (optional) </li>
              <li>Pilih / Ketik produk.</li>
              <li>Masukkan Jumlah produk</li>
              <li>Anda bisa mengganti harga produk jika ingin saat transaksi / menggunakan harga yang ditentukan.</li>
              <li>Klik tombol <code>TAMBAH</code> untuk menambahkan produk ke daftar transaksi</li>
              <li>Ulangi untuk menambah produk lain yang dibeli</li>
              <li>Jika semua produk yang ditentukan sudah dipilih, klik <code>SIMPAN TRANSAKSI</code> untuk menyelesaikan dan menyimpan transaksi</li>
            </ol>
          </div>
          <br />
          <Typography variant="h3">
            B. Daftar & Detail Transaksi
          </Typography><br />
          <div className="ml-[22px] pl-[22px] text-xl">
            <p>Anda bisa melihat daftar dari transaksi penjualan yang telah dilakukan, sekaligus detail dari setiap transaksi melalui menu <code>PENJUALAN &gt; DAFTAR TRANSAKSI</code>
            , berikut dibawah ini adalah penjelasan dari setiap kolom :</p>
              <ol type="number">
                <li><code>waktu :</code> Berisi data tanggal dan jam dimana transaksi terakhir disimpan dan diubah.</li>
                <li><code>kode :</code> Adalah kode unik setiap transaksi, terdiri dari keterangan penjualan, tahun, bulan dan nomor urut.</li>
                <li><code>total harga :</code> Adalah jumlah total harga dari transaksi tersebut</li>
                <li><code>status :</code> Berisi keterangan status transaksi, seperti : &quot;SELESAI&quot; ; &quot;BATAL&quot; </li>
                <li><code>metode :</code> Adalah metode yang pembayaran yang digunakan seperti CASH dan BANK / Transfer </li>
                <li><code>pelanggan :</code> Adalah nama pelanggan terdaftar yang dipilih atau dimasukkan secara manual (optional) </li>
                <li><code>detail :</code> Adalah tombol yang digunakan untuk melihat Detail Transaksi ketika diklik / ditekan.</li>
              </ol>
          </div>
          <br />
          <Typography variant="h3">
            C. Daftar Pelanggan
          </Typography>
          <div className="ml-[22px] pl-[22px] text-xl">
            <p>Adalah halaman yang berisi daftar pelanggan terdaftar</p>
          </div><br />
          <Typography variant="h3">
            D. Tambah Pelanggan
          </Typography>
          <div className="ml-[22px] pl-[22px] text-xl">
            <p>Adalah halaman yang digunakan untuk mendaftarkan pelanggan ke sistem. Berikut adalah cara bagaimana untuk mendaftarkan pelanggan ke sistem penjualan :</p>
            <ol type="number">
              <li>Masukkan Nama Pelanggan di Input Nama.</li>
              <li>Masukkan email pelanggan (jika ada)</li>
              <li>Masukkan nomor telepon pelanggan (jika ada)</li>
              <li>Masukkan alamat pelanggan (opsional)</li>
              <li>Klik tombol Tambah Pelanggan untuk menyimpan data pelanggan</li>
            </ol>
          </div><br />
          <Typography variant="h3">
            E. Daftar Produk
          </Typography>
          <div className="ml-[22px] pl-[22px] text-xl">
            <p>Adalah halaman yang berisi daftar produk yang dimasukkan kedalam sistem, berikut dibawah ini adalah penjelasan dari masing-masing kolom pada daftar produk :</p>
            <ol type="number">
              <li><code>no :</code> Nomor urut produk.</li>
              <li><code>nama :</code> Adalah Nama Produk yang didaftarkan.</li>
              <li><code>harga :</code> Adalah nilai harga jual yang ditentukan untuk menjual barang</li>
              <li><code>harga beli :</code> Adalah nilai harga beli yang ditentukan untuk membeli / re-stock barang</li>
              <li><code>satuan :</code> Adalah format satuan dari produk tersebut.</li>
              <li><code>stok :</code> Adalah nilai stok produk yang ada.</li>
              <li><code>kategori :</code> Adalah nama kategori dari produk </li>
              <li><code>jenis :</code> Adalah jenis produk yang dijual, ada 2 yaitu jenis &quot;BARANG&quot; dan &quot;PANGAN&quot; ini menentukan apakah produk tersebut memiliki tanggal kadaluarsa.</li>
              <li><code>status :</code> Adalah status produk tersebut, masih aktif dijual atau tidak.</li>
              <li><code>detail :</code> Adalah tombol yang digunakan untuk melihat Detail Produk ketika diklik / ditekan.</li>
            </ol>
          </div><br />
          <Typography variant="h3">
            F. Ganti Data Akun Karyawan
          </Typography>
          <div className="ml-[22px] pl-[22px] text-xl">
            <p>Berikut dibawah ini adalah cara bagaimana untuk mengganti data akun karyawan, data yang bisa diganti adalah nama dan email akun :</p>
            <ol type="number">
              <li>Pada sidebar klik Manajemen Akun.</li>
              <li>Klik Tabel Akun.</li>
              <li>Pada Tabel Akun Karyawan, lihat akun mana yang akan anda ganti datanya, kemudian klik tombol <code>EDIT</code> sesuai dengan baris akun yang ingin diganti datanya.</li>
              <li>Pada dialog box yang muncul, jika nama yang diganti maka hapus nama awal kemudian ketik nama yang baru.</li>
              <li>Pada dialog box yang muncul, jika email yang diganti maka hapus email awal kemudian ketik email yang baru.</li>
              <li>Ketik MasterKEY yang disimpan di <code>ENVIRONMENT</code> website.</li>
              <li>Jika dirasa data yang diganti sudah benar maka klik tombol <code>KIRIM</code>.</li>
              <li>Jika tidak maka keluar dengan klik tombol <code>BATAL</code>.</li>
            </ol>
          </div><br />
          <Typography variant="h3">
            G. Registrasi Akun
          </Typography>
          <div className="ml-[22px] pl-[22px] text-xl">
            <p>Berikut dibawah ini adalah bagaimana cara mendaftarkan akun untuk Admin dan atau Karyawan :</p>
            <ol type="number">
              <li>Pada sidebar, klik Manajemen Akun.</li>
              <li>Kemudian klik Registrasi Akun.</li>
              <li>Kemudian masukkan nama di kolom <code>Nama Akun</code>.</li>
              <li>Kemudian masukkan email di kolom <code>Email Akun</code>.</li>
              <li>Kemudian masukkan password akun di kolom <code>Password</code>.</li>
              <li>Kemudian pilih tipe akun, &quot;ADMIN&quot; atau &quot;KARYAWAN&quot;.</li>
              <li>Lihat kembali data yang anda masukkan, jika sudah benar maka klik tombol <code>DAFTAR</code></li>
            </ol>
          </div><br />
          <Typography variant="h3">
            H. Reset Password Akun Karyawan
          </Typography>
          <div className="ml-[22px] pl-[22px] text-xl">
            <p>Berikut dibawah ini adalah bagaimana cara mengganti password akun karyawan :</p>
            <ol type="number">
              <li>Pada sidebar, klik Manajemen Akun.</li>
              <li>Kemudian klik Reset Password Akun.</li>
              <li>Masukkan email akun karyawan di kolom <code>Email Karyawan</code>.</li>
              <li>Masukkan Password yang baru di kolom <code>Password</code>.</li>
              <li>Masukkan kembali password yang baru di kolom <code>Konfirmasi Password</code>.</li>
              <li>Jika data sudah benar maka klik tombol <code>Reset Password</code>.</li>
            </ol>
          </div><br />
          <Typography variant="h3">
            I. Reset Password Akun Admin
          </Typography>
          <div className="ml-[22px] pl-[22px] text-xl">
            <p>Berikut dibawah ini adalah bagaimana cara mengganti password akun admin :</p>
            <ol type="number">
              <li>Pada sidebar, klik Manajemen Akun.</li>
              <li>Kemudian klik Reset Password Akun.</li>
              <li>Masukkan Email Akun Admin di kolom <code>Email Admin</code>.</li>
              <li>Masukkan Password admin yang baru di kolom <code>Password</code>.</li>
              <li>Masukkan kembali passsword yang baru di kolom <code>Konfirmasi Password</code>.</li>
              <li>Masukkan kode MasterKEY di kolom <code>Master Key</code>.</li>
              <li>Jika data sudah benar, maka klik tombol <code>Reset Password Admin</code>.</li>
            </ol>
          </div><br />
          <Divider />
          <br />
          <Typography variant="h3" sx={{fontWeight:'bold'}}>
            Daftar Error
          </Typography><br />
          <Divider /><br />
          <div className="ml-[22px] pl-[22px] text-xl">
          <p>Berikut dibawah ini adalah daftar error yang kemungkinan muncul beserta dengan penjelasan dan cara menanganinya :</p>
          <ul>
          <li><code className="text-red-600">MasterKEY Salah</code>: Master Key yang dimasukkan tidak sesuai dengan yang ada, cek kembali apakah master key yang dimasukkan sama dengan yang ada di <code>Environment Variable</code> website.</li>
          <li><code className="text-red-600">Data Tidak Boleh Kosong</code>: Terdapat kolom yang kosong disaat akan mengirim / menyimpan data, cek kembali kolom mana yang kosong.</li>
          <li><code className="text-red-600">Tidak Ada Data</code>: Data tidak ditemukan.</li>
          <li><code className="text-red-600">No Rows</code>: Data tidak ditemukan.</li>
          <li><code className="text-red-600">Gagal Menambahkan / Mengirim Data</code>: Terjadi kesalahan saat akan mengirim / menyimpan data, pastikan database terkoneksi dengan baik, jika anda menggunakan PostgreSQL pastika server PostgreSQL masih berjalan, atau pastikan anda masih terhubung ke internet.</li>

          </ul>

          </div>


        </Box>
      </div>
    </div>
  )
}

export default HalamanBantuan
