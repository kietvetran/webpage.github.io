id := 
sb1_form_button_warning

range :=
5

name := 
Advarselknapp

approved :=
01.12.2014

tag := 


teaser :=
<i class="sb1_lib_button_warning">S</i>

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
<button class="warning-btn">Avslutt konto</button>
<a href="#" role="button" class="warning-btn">Slett avtale</a>
<input class="warning-btn" value="Sperr kort" type="submit">
-d_e

-d_s
name :=
CSS-kode

code :=
background-color: #da3d00;
border-radius: 4px;
color: white;
cursor: pointer;
font-family: "MuseoSansRounded-700";
font-size: 18px;
line-height: 22px;
padding: 14px 30px;
text-align: center;
text-decoration: none;
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
