const SUPABASE_URL = "https://noigdwxatglodhspztok.supabase.co";
const SUPABASE_KEY = "sb_publishable_YRV3El5ZT_u52wHf1ylvOA_AKUpGXDl";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ===============================
// MENYIMPAN CATATAN
// ===============================
async function tambahCatatan() {

    const judul = document.getElementById("judul").value.trim();
    const isi = document.getElementById("isi").value.trim();

    if (judul === "" || isi === "") {
        alert("Judul dan isi catatan harus diisi!");
        return;
    }

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

    // Tampilkan data terbaru
    muatCatatan();
}


// ===============================
// MEMUAT CATATAN DARI DATABASE
// ===============================
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

        const div = document.createElement("div");
        div.className = "catatan";

        const judul = document.createElement("h3");
        judul.textContent = catatan.judul;

        const isi = document.createElement("p");
        isi.textContent = catatan.isi;

        div.appendChild(judul);
        div.appendChild(isi);

        daftar.appendChild(div);
    });
}


// Jalankan saat website dibuka
muatCatatan();