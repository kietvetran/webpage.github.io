id := 
sb1_text_body

range :=
1

name := 
Bodytekst

approved :=

tag := 
text
tekst
avsnitt
artikkel


teaser :=

detail 	:=
-d_s 
name := 
Hvordan bruke

description :=
Bodytekst er brødtekst i artikkel og lengre avsnitt. 

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
<div>div-tag:Lorem ipsum dolor sit amet..</div>
<p>p-tag:Lorem ipsum dolor sit amet..</p>
<ul><li>li-tag:Lorem ipsum dolor sit amet..</li></ul>

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
