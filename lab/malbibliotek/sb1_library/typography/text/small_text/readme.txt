id := 
sb1_text_small

range :=
6

name := 
Liten tekst

approved :=

tag := 
small
subtle
#tekst

teaser :=

detail 	:=
-d_s 
name := 
Hvordan bruke

description :=
Denne teksten er mindre enn vanlig skrift og brukes gjerne i kombinasjon med medium eller stor tekst for å skape en teksteffekt. 

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
<div class="subtle-text">Små tekst</div>
-d_e

-d_s
name :=
CSS-kode

code :=
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
