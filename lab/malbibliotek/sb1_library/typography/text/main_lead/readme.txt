id := 
sb1_text_main_lead

range :=
2

name := 
Hovedingress

approved :=

tag := 
summary
ingress
#tekst

teaser :=

detail 	:=
-d_s 
name := 
Hvordan bruke

description :=
Denne stilen benyttes på toppen av seksjonssider og hovedområder. Skal ikke brukes på artikkelnivå. Tilhører H1 type overskrifter. 

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
