id := 
sb1_form_checkbox

range :=
1

name := 
Checkboks

approved :=

tag := 
input
checkboks
checkbox
Avkrysning
Avkrysningsboks
liste
Flervalg


teaser :=
<i class="sb1_lib_input_checkbox"></i>

detail :=
-d_s 
name := 
Hvordan bruke

description :=
<p>
	En enkelt avkrysningsboks skal brukes der hvor et spørsmål bare har to mulige svar - 
	negativt og positivt.
</p>
<p>
	Avkrysningsbokser skal i utgangspunktet ha tilstanden ikke avkrysset. De er 
	avkrysset bare der bruker tidligere har valgt å krysse dem av - eks. i redigeringsmodus.
</p>

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
<input class="sb1_input_checkbox" checked="" name="checkbox0" id="checkbox0" type="checkbox">
<label for="checkbox0">Velg meg!</label>
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
src/less/common/icon-font.less
src/less/common/icons.less
src/less/common/buttons.less
src/less/common/typography.less
src/less/common/sb1_input_checkbox.less
src/less/common/sb1_form_validation.less

js_depending :=
src/js/jquery/1.8.3.jquery.js
src/js/plugins/sb1_form_validation.js

image_depending :=
src/images/sb1_checkbox_focus.svg
src/images/sb1_checkbox_hover.svg
src/images/sb1_checkbox_selected.svg
src/images/sb1_checkbox_selected_disabled.svg
src/images/sb1_checkbox_unselected_disabled.svg
src/images/sb1_checkbox_unselected_error.svg
src/images/sb1_checkbox_unselected.svg
src/images/sb1_checkmark.svg
