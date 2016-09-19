id := 
sb1_form_button_secondary

range :=
3

name := 
Sekundær

approved :=
01.12.2014

tag := 


teaser :=
<i class="sb1_lib_button_item sb1_lib_button_secondary">Forrige</i>

detail :=
-d_s 
name := 
Hvordan bruke

description :=
<p>
	Knappestilen brukes for alternativer til primærhandlingen. 
	Eksempler: “Tilbake”, “Ring meg om dette”.
</p>
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
<button class="secondary-btn">Endre spareavtale</button>
<a href="#" role="button" class="secondary-btn">Forrige</a>
<input class="secondary-btn" value="Salg" type="submit">
-d_e

-d_s
name :=
CSS-kode

code :=
border-radius: 4px;
cursor: pointer;
font-family: "MuseoSansRounded-700";
font-size: 18px;
line-height: 22px;
padding: 14px 30px;
text-align: center;
text-decoration: none;
background-color: white;
border: 1px solid #d8d8d8;
color: #008ed2;
-d_e

directory_depending :=
src/fonts
src/bootstrap
src/icons

less_import :=
../bootstrap/less/variables.less
../bootstrap/less/mixins.less
../bootstrap/less/normalize.less

less_depending :=
src/less/common/variables.less
src/less/mixins/fontface.less
src/less/common/typography.less
src/less/common/icon-font.less
src/less/common/icons.less
src/less/common/buttons.less
