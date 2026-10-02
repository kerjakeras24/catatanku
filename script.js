function tambahCatatan() {

    const judul = document.getElementById("judul").value;
    const isi = document.getElementById("isi").value;

    if (judul === "" || isi === "") {
        alert("Judul dan isi catatan harus diisi!");
        return;
    }

    const catatan = document.createElement("div");

    catatan.className = "catatan";

    catatan.innerHTML = `
        <h3>${judul}</h3>
        <p>${isi}</p>
    `;

    document.getElementById("daftarCatatan").appendChild(catatan);

    document.getElementById("judul").value = "";
    document.getElementById("isi").value = "";
}