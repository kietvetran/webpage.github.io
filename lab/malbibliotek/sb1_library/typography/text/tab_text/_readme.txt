id := 
sb1_text_tab

range :=
12

name := 
Tab text

approved :=

tag := 
tab

teaser :=

detail 	:=
-d_s 
name := 
Hvordan bruke

description :=
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin cursus tortor sed nisl tincidunt, vitae efficitur elit congue.

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
<p class="main-lead">Hovedingress</p>
-d_e

-d_s
name :=
CSS-kode

code :=
font-family: "MuseoSansRounded-700";
color: #002776;
text-align: center;
font-size: 24px;
line-height: 35px;
display: block;
margin-left: auto;
margin-right: auto;
-d_e


-d_s
name :=
CSS-kode for mobil på 320px

code :=
?
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