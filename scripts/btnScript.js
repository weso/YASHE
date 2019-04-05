const btnRDF = document.getElementById('btnRDF')
const btnWiki = document.getElementById('btnWiki')
const btnJapan = document.getElementById('btnJapan')

  btnRDF.addEventListener('click', function(e) {
    // Set editor Size
    yashe.setSize(null,"250")
    yashe.setValue(rdfValue)
  })

  btnWiki.addEventListener('click', function(e) {
    // Set editor Size
    yashe.setSize(null,"600")
    yashe.setValue(wikiValue)
  })

  btnJapan.addEventListener('click', function(e) {
    // Set editor Size
    yashe.setSize(null,"600")
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


const wikiValue = "# BASE <https://raw.githubusercontent.com/SuLab/Genewiki-ShEx/master/proteins/Wikidata-human-proteins.shex>\n"+
"# Shape Expression for Human proteins in Wikidata\n\n"+

"PREFIX wd: <http://www.wikidata.org/entity/>\n"+
"PREFIX wdt: <http://www.wikidata.org/prop/direct/>\n"+
"PREFIX p: <http://www.wikidata.org/prop/>\n"+
"PREFIX prov: <http://www.w3.org/ns/prov#>\n"+
"PREFIX pq: <http://www.wikidata.org/prop/qualifier/>\n"+
"PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n"+
"PREFIX prv: <http://www.wikidata.org/prop/reference/value/>\n"+
"PREFIX pr:  <http://www.wikidata.org/prop/reference/>\n"+
"PREFIX ps: <http://www.wikidata.org/prop/statement/>\n"+
"PREFIX interpro: <http://micel.io/genewiki/interpro/>\n\n"+

"start = @<#wikidata-human-protein>\n\n"+

"# wikidata-human protein is the main shape for a human protein data model in Wikidata. Each line between the brackets\n"+
"# represents the structure that can be enforced to validate human protein annotations in Wikidata\n"+
"#\n"+
"# We distinguish between value statements, identifier statements, and erronuous statements.\n"+
"# Value statements contain either actual values, or pointers to other Wikidata items. Identifier statements capture\n"+
"# external identifiers, erronuous statements are those that are errors.\n"+
"#\n\n"+

"<#wikidata-human-protein> {\n"+
	"# STATEMENTS\n"+
	"p:P31 @<#P31_instance_of> ;\n"+
	"p:P361 @<#P361_part_of>* ;\n"+
	"p:P527 @<#P527_has_part>* ;\n"+
	"p:P680 @<#P680_molecular_function>* ;\n"+
	"p:P681 @<#P681_cell_component>* ;\n"+
	"p:P682 @<#P682_biological_process>* ;\n"+
	"p:P702 @<#P702_encoded_by> ;\n"+
	"p:P703 @<#P703_found_in_taxon_human> ;\n"+
	"p:P1910 @<#P1910_decreased_expression_in>* ;\n\n"+

	"# IDENTIFIERS\n"+
	"p:P352 @<#P352_uniprot_id>+ ;\n"+
	"p:P705 @<#P705_ensembl_protein_id>* ;\n"+
	"p:P637 @<#P637_RefSeq_Protein_ID>* ; \n"+
  "p:P639 @<#P639_RefSeq_RNA_ID>* ; # Currently, we decided to model this, but change in the future if we find a more acurate representation\n\n"+

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

