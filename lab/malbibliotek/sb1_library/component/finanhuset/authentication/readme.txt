id := 
sb1_component_authentication

range :=
99

name := 
Autentisering

approved :=

tag := 
bankid

teaser :=

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
  <iframe frameborder="0" src="https://tools-preprod.bankid.no/bankid-test/sign/pdf"></iframe>
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
