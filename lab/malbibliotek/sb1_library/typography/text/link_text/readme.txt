id := 
sb1_text_link

range :=
11

name := 
Lenketekst

approved :=

tag := 
link
#tekst

teaser :=

detail 	:=
-d_s 
name := 
Hvordan bruke

description :=
Brukes for å lenke til andre sider eller områder på samme side. Lenketekst bør være kort, gjerne kun ett ord, og inneholde beskrivende ord. Ikke bruk "klikk her", "les mer", "gå til" etc., men meningsbærende ord og setninger som "prøv boligkalkulatoren" eller "sjekk pris på bilforsikring". 

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
<a href="#">Hovedingress</a>
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