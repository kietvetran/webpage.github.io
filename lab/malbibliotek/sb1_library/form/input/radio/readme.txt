id := 
sb1_form_radio

range :=
2

name := 
Radioknapp

approved :=

tag := 
#skjema
#bestillingsprosess
#knapp
#flervalg
#velgere
alternativ
enten eller

teaser :=
<i class="sb1_lib_input_radio"></i>

detail :=
-d_s 
name := 
Hvordan bruke

description :=
<p>
	En radioknapp skal brukes der et spørsmål har flere mulige svar som utelukker hverandre, f.eks "Mann" og "Kvinne".
</p>
<p>
	Det skal helst være oppgitt en standard verdi (default), bortsett fra hvis vi ikke kan gjette - f.eks. 	“Mann” og “Kvinne”.
</p>

<p class="graphic_text front_end_text">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis sed lectus ac scelerisque. Vivamus vitae neque dui. Quisque pretium lorem ac interdum vehicula. Sed maximus tincidunt justo, vitae congue justo rutrum vitae. Cras nec tellus eget purus consequat tempus eget ac risus. Sed tincidunt elementum porttitor. Quisque aliquam magna tincidunt sodales porta. Vestibulum tristique lacinia nulla sed interdum. 
</p>

<p class="interaction_text">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis sed lectus ac scelerisque. Vivamus vitae neque dui. Quisque pretium lorem ac interdum vehicula. Sed maximus tincidunt justo, vitae congue justo rutrum vitae. Cras nec tellus eget purus consequat tempus eget ac risus. Sed tincidunt elementum porttitor. Quisque aliquam magna tincidunt sodales porta. Vestibulum tristique lacinia nulla sed interdum. 
</p>

<p class="front_end_text">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis sed lectus ac scelerisque. Vivamus vitae neque dui. Quisque pretium lorem ac interdum vehicula. Sed maximus tincidunt justo, vitae congue justo rutrum vitae. Cras nec tellus eget purus consequat tempus eget ac risus. Sed tincidunt elementum porttitor. Quisque aliquam magna tincidunt sodales porta. Vestibulum tristique lacinia nulla sed interdum. 
</p>

<p class="content_text">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis sed lectus ac scelerisque. Vivamus vitae neque dui. Quisque pretium lorem ac interdum vehicula. Sed maximus tincidunt justo, vitae congue justo rutrum vitae. Cras nec tellus eget purus consequat tempus eget ac risus. Sed tincidunt elementum porttitor. Quisque aliquam magna tincidunt sodales porta. Vestibulum tristique lacinia nulla sed interdum. 
</p>

<div>
	<a data-rule="{'id':'component_finanshuset_1'}" class="sb1_link_item" href="#">
		Se skjemavalidering og Universell utforming
	</a> for hvordan feilmeldinger vises i forbindelse med radio-knapper.
</div>

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
<input id="radioA" name="radio1" checked="" class="sb1-input-radio" type="radio">
<label for="radioA">Alternativ 1</label>
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
src/less/common/icon-font.less
src/less/common/icons.less
src/less/common/buttons.less
src/less/common/sb1_input_radio.less
src/less/common/sb1_form_validation.less

js_depending :=
src/js/jquery/1.8.3.jquery.js
src/js/plugins/sb1_form_validation.js

image_depending :=
src/images/sb1_radio_focus.svg
src/images/sb1_radio_selected.svg
src/images/sb1_radio_selected_disabled.svg
src/images/sb1_radio_unselected_disabled.svg
src/images/sb1_radio_unselected_error.svg
src/images/sb1_radio_unselected.svg
