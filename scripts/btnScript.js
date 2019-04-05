const btnRDF = document.getElementById('btnRDF')
const btnWiki = document.getElementById('btnWiki')
const btnJapan = document.getElementById('btnJapan')

btnRDF.addEventListener('click', function(e) {
  yashe.setValue(rdfValue)
})

btnWiki.addEventListener('click', function(e) {
  yashe.setValue(wikiValue)
})

btnJapan.addEventListener('click', function(e) {
  yashe.setValue(japanValue)
})


const rdfValue = "PREFIX :       <http://example.org/>\n"+
"PREFIX schema: <http://schema.org/>\n"+
"PREFIX xsd:    <http://www.w3.org/2001/XMLSchema#>\n\n"+

":User IRI {\n"+ 
"  schema:name          xsd:string  ;\n"+
"  schema:birthDate     xsd:date?  ;\n"+
"  schema:gender        [ schema:Male schema:Female ] ;\n"+
"  schema:knows         @:User* \n"+
"}"


const wikiValue = "PREFIX :       <http://example.org/>\n"+
"PREFIX schema: <http://schema.org/>\n"+
"PREFIX xsd:    <http://www.w3.org/2001/XMLSchema#>\n\n"+

":User IRI {\n"+ 
"  schema:name          xsd:string  ;\n"+
"  schema:birthDate     xsd:date?  ;\n"+
"  schema:gender        [ schema:Male schema:Female ] ;\n"+
"  schema:knows         @:User* \n"+
"}"

const japanValue = "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n"+
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n"+
"PREFIX schema: <http://schema.org/>\n"+
"PREFIX jps: <https://jpsearch.go.jp/term/property#>\n"+
"PREFIX type: <https://jpsearch.go.jp/term/type/>\n"+
"PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n"+
"PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n"+
"PREFIX jpshape: <https://jpsearch.go.jp/shape/>\n\n"+
"jpshape:CHO IRI {\n"+
" a IRI ;\n"+
" rdfs:label Literal ;\n"+
" schema:name Literal+ ;\n"+
" schema:contributor (@jpshape:Agent OR IRI)* ;\n"+
" schema:temporal (@jpshape:Time OR IRI)* ;\n"+
" schema:spatial (@jpshape:Place OR IRI)* ;\n"+
" schema:about IRI* ;\n"+
" schema:identifier Literal* ;\n"+
" schema:isbn Literal* ;\n"+
" schema:issn Literal* ;\n"+
" schema:inLanguage IRI* ;\n"+
" schema:image IRI* ;\n"+
" schema:description Literal* ;\n"+
" schema:isPartOf (@jpshape:CHO OR IRI)* ;\n"+
" schema:relatedLink IRI* ;\n"+
" schema:creator (@jpshape:Agent OR IRI)* ;\n"+
" schema:publisher (@jpshape:Agent OR IRI)* ;\n"+
" schema:dateCreated Literal* ;\n"+
" schema:datePublished Literal* ;\n"+
" jps:agential @jpshape:Who* ;\n"+
" jps:temporal @jpshape:When* ;\n"+
" jps:spatial @jpshape:Where* ;\n"+
" jps:partOf @jpshape:Upper* ;\n"+
" jps:relatedLink @jpshape:Related* ;\n"+
" jps:accessInfo @jpshape:Access+ ;\n"+
" jps:sourceInfo @jpshape:Source\n"+
"}"

