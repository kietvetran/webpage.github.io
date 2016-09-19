id := 
sb1_form_button_info

range :=
4

name := 
Infoknapp / sekundær knapp 2

approved :=
01.12.2014

tag := 


teaser :=
<i class="sb1_lib_button_item sb1_lib_button_info">Endre</i>

detail :=
-d_s 
name := 
Hvordan bruke

description :=


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
<button class="info-btn">Logg ut</button>
<a href="#" role="button" class="info-btn">Endre</a>
<input class="info-btn" value="Avbryt" type="submit">
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
border: 2px solid #d8d8d8;
color: #da3d00;
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
