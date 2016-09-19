id := 
sb1_text_lead

range :=
3

name := 
Ingress

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
Denne stilen benyttes i artikler og produktbeskrivelser. Kan kobles til H1, H2 og H3 overskrifter, men ikke mindre overskrifter enn H3. 

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
<p class="lead">Ingress</p>
-d_e

-d_s
name :=
CSS-kode

code :=
font-family: "MuseoSansRounded-700";
color: #002776;
text-align: center;
font-size: 18px;
line-height: 27px;
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
