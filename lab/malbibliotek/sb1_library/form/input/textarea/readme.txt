id := 
sb1_form_textarea

range :=
4

name := 
Stort tekstfelt

approved :=

tag :=
tekst
tekstfelt
input
fritekst

teaser :=
<i class="sb1_lib_field_textarea"></i>

detail :=
-d_s 
name := 
Hvordan bruke

description :=
Stort tekstfelt er beregnet for fritekst input fra brukeren som gjerne krever flere linjer. 
Det er vanligvis ingen validering av feltet. Bredden på inputfeltet bør ikke være bredere 
enn XXX tegn på grunn av lesevennlighet. Antall linjer som vises til enhver tid er. XXX. 
Stort tekstfelt skal alltid ha ledetekst. 
<a data-rule="{'id':'component_finanshuset_1'}" class="sb1_link_item" href="#">
Se skjemavalidering og Universell utforming
</a> for hvordan feilmeldinger vises i forbindelse med stort tekstfelt.

-d_e
-d_s
name :=
Demo

iframe :=
{PATH}/index.html
-d_e
-d_s
name :=
HTML-kode

code :=
<textarea></textarea>
-d_e

-d_s
name :=
CSS-kode

code :=
border: 2px solid #d8d8d8;
line-height: 25px;
font-size: 17px;
border-radius: 4px;
padding: 0 10px;
width: 100%;
height: 110px;
color: #545454;
resize: none;
-d_e

directory_depending :=
src/fonts
src/bootstrap

less_import :=
../bootstrap/less/variables.less
../bootstrap/less/mixins.less
../bootstrap/less/normalize.less

less_depending :=
src/less/common/variables.less
src/less/mixins/fontface.less
src/less/common/typography.less
src/less/common/form.less