import { useState } from "react";
import { data } from "../data";

export default function Home() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ marque: "", gamme: "", charge: "" });
  const [zoomImg, setZoomImg] = useState(null);

  const searchTerms = search.toLowerCase().split(" ").filter(Boolean);

  const filtered = data.filter(function(item) {
    var target = (item.code + " " + item.designation + " " + item.marque + " " + item.gamme + " " + item.charge).toLowerCase();
    var matchesSearch = searchTerms.every(function(term) {
      return target.includes(term);
    });

    var matchesFilters = true;
    for (var key in filters) {
      if (filters[key] && item[key]) {
        if (item[key].toLowerCase() !== filters[key].toLowerCase()) {
          matchesFilters = false;
          break;
        }
      }
    }

    return matchesSearch && matchesFilters;
  });

  var marques = [];
  var gammes = [];
  var charges = [];

  for (var i = 0; i < data.length; i++) {
    if (data[i].marque && !marques.includes(data[i].marque)) marques.push(data[i].marque);
    if (data[i].gamme && !gammes.includes(data[i].gamme)) gammes.push(data[i].gamme);
    if (data[i].charge && !charges.includes(data[i].charge)) charges.push(data[i].charge);
  }

  var sorted = filtered.sort(function(a, b) {
    return (a.designation || "").localeCompare(b.designation || "");
  });

  return (
    <div className="p-4">
      <h1 className="text-center text-xl font-bold mb-4">Catalogue Coffrage</h1>
      <input
        className="w-full border p-2 mb-2"
        placeholder="Rechercher une pièce..."
        value={search}
        onChange={function(e) { setSearch(e.target.value); }}
      />

      <div className="flex gap-2 mb-4">
        <select onChange={function(e) { setFilters(Object.assign({}, filters, { marque: e.target.value })); }}>
          <option value="">Toutes les marques</option>
          {marques.map(function(m, i) { return <option key={i} value={m}>{m}</option>; })}
        </select>
        <select onChange={function(e) { setFilters(Object.assign({}, filters, { gamme: e.target.value })); }}>
          <option value="">Toutes les gammes</option>
          {gammes.map(function(g, i) { return <option key={i} value={g}>{g}</option>; })}
        </select>
        <select onChange={function(e) { setFilters(Object.assign({}, filters, { charge: e.target.value })); }}>
          <option value="">Toutes les charges</option>
          {charges.map(function(c, i) { return <option key={i} value={c}>{c}</option>; })}
        </select>
      </div>

      {zoomImg && (
        <div
          onClick={function() { setZoomImg(null); }}
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
        >
          <img src={"/images/" + zoomImg} className="max-w-full max-h-[90vh] rounded" alt="Zoom" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sorted.map(function(item, i) {
          var imgPath = "/images/" + item.code + ".jpg";
          var pdfPath = "/pdf/" + item.code + ".pdf";
          return (
            <div key={i} className="border rounded-lg p-2 bg-white shadow">
              <img
                src={imgPath}
                alt="visuel"
                className="w-full h-40 object-contain cursor-zoom-in"
                onClick={function() { setZoomImg(item.code + ".jpg"); }}
                onError={function(e) { e.target.style.display = "none"; }}
              />
              <div className="p-2">
                <strong>{item.designation}</strong><br />
                <span className="text-xs text-gray-500">Code : {item.code}</span><br />
                Marque : {item.marque}<br />
                Gamme : {item.gamme}<br />
                Charge max : {item.charge}<br />
                Poids : {item.poids}<br />
                {item.code && (
                  <a
                    href={pdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block bg-blue-500 text-white px-4 py-1 rounded"
                  >
                    Voir fiche technique
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}