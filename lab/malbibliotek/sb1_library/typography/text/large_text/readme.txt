id := 
sb1_text_large

range :=
4

name := 
Stor tekst

approved :=

tag := 
large text
#tekst
utheving
beløp

teaser :=

detail 	:=
-d_s 
name := 
Hvordan bruke

description :=
Denne stilen brukes for å fremheve enkeltord og beløp. Dette vil være større enn vanlig tekststørrelse uten at det blir strukturelt tagget som en overskrift. 

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
<div class="large-text">Stor tekst</div>
-d_e

-d_s
name :=
CSS-kode

code :=
?
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
