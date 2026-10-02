const SUPABASE_URL = "https://noigdwxatglodhspztok.supabase.co";
const SUPABASE_KEY = "sb_publishable_YRV3El5ZT_u52wHf1ylvOA_AKUpGXDl";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =====================================
// ID CATATAN YANG SEDANG DIEDIT
// =====================================

let idSedangDiedit = null;


// =====================================
// TAMBAH CATATAN
// =====================================

async function tambahCatatan() {

    const judul = document.getElementById("judul").value.trim();
    const isi = document.getElementById("isi").value.trim();


    // Cek apakah kosong
    if (judul === "" || isi === "") {

        alert("Judul dan isi catatan harus diisi!");

        return;
    }


    // =================================
    // JIKA SEDANG EDIT
    // =================================

    if (idSedangDiedit !== null) {

        const { error } = await supabaseClient
            .from("catatan")
            .update({
                judul: judul,
                isi: isi
            })
            .eq("id", idSedangDiedit);


        if (error) {

            console.error("Error:", error);

            alert("Gagal mengubah catatan!");

            return;
        }


        alert("Catatan berhasil diubah!");


        // Kembali ke mode tambah
        batalEdit();


        // Muat ulang catatan
        muatCatatan();


        return;
    }


    // =================================
    // TAMBAH CATATAN BARU
    // =================================

    const { error } = await supabaseClient
        .from("catatan")
        .insert([
            {
                judul: judul,
                isi: isi
            }
        ]);


    if (error) {

        console.error("Error:", error);

        alert("Gagal menyimpan catatan!");

        return;
    }


    // Kosongkan form
    document.getElementById("judul").value = "";
    document.getElementById("isi").value = "";


    // Muat catatan
    muatCatatan();
}


// =====================================
// MEMUAT CATATAN
// =====================================

async function muatCatatan() {

    const { data, error } = await supabaseClient
        .from("catatan")
        .select("id, judul, isi, created_at")
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error("Error:", error);

        return;
    }


    const daftar = document.getElementById("daftarCatatan");

    daftar.innerHTML = "";


    data.forEach(function(catatan) {

        // Container catatan
        const div = document.createElement("div");

        div.className = "catatan";


        // =================================
        // JUDUL
        // =================================

        const judul = document.createElement("h3");

        judul.textContent = catatan.judul;


        // =================================
        // ISI
        // =================================

        const isi = document.createElement("p");

        isi.textContent = catatan.isi;


        div.appendChild(judul);

        div.appendChild(isi);


        // =================================
        // TOMBOL EDIT
        // =================================

        const tombolEdit = document.createElement("button");

        tombolEdit.textContent = "✏️ Edit";


        tombolEdit.onclick = function() {

            mulaiEdit(catatan);

        };


        div.appendChild(tombolEdit);


        // =================================
        // TOMBOL HAPUS
        // =================================

        const tombolHapus = document.createElement("button");

        tombolHapus.textContent = "🗑️ Hapus";


        tombolHapus.onclick = function() {

            hapusCatatan(catatan.id);

        };


        div.appendChild(tombolHapus);


        // Masukkan ke halaman
        daftar.appendChild(div);

    });
}


// =====================================
// MULAI EDIT
// =====================================

function mulaiEdit(catatan) {

    // Simpan ID catatan
    idSedangDiedit = catatan.id;


    // Masukkan judul ke form
    document.getElementById("judul").value = catatan.judul;


    // Masukkan isi ke textarea
    document.getElementById("isi").value = catatan.isi;


    // Ubah tulisan tombol
    document.getElementById("tombolSimpan").textContent =
        "💾 Simpan Perubahan";


    // Tampilkan tombol batal
    document.getElementById("tombolBatal").style.display =
        "block";


    // Scroll ke bagian atas
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// =====================================
// BATAL EDIT
// =====================================

function batalEdit() {

    // Hapus ID edit
    idSedangDiedit = null;


    // Kosongkan form
    document.getElementById("judul").value = "";

    document.getElementById("isi").value = "";


    // Kembalikan tombol
    document.getElementById("tombolSimpan").textContent =
        "➕ Simpan Catatan";


    // Sembunyikan tombol batal
    document.getElementById("tombolBatal").style.display =
        "none";

}


// =====================================
// HAPUS CATATAN
// =====================================

async function hapusCatatan(id) {

    const yakin = confirm(
        "Yakin mau menghapus catatan ini?"
    );


    if (!yakin) {

        return;

    }


    const { error } = await supabaseClient
        .from("catatan")
        .delete()
        .eq("id", id);


    if (error) {

        console.error("Error:", error);

        alert("Gagal menghapus catatan!");

        return;
    }


    muatCatatan();

}


// =====================================
// JALANKAN SAAT WEBSITE DIBUKA
// =====================================

muatCatatan();