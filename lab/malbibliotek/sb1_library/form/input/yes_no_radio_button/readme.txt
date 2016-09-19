id := 
sb1_form_yes_no_radio

range :=
3

name := 
Ja / Nei knapp

approved :=

tag := 
Ja
Nei
Radio
Radioknapp


teaser :=
<i class="sb1_lib_input_yes_no_radio"></i>

detail :=
-d_s 
name := 
Hvordan bruke

description :=
Et alternativ til radioknapper der hvor brukeren bare har to eller tre valg, og 
der tittel på valgene er svært kort - kort nok til at knappene havner på samme 
linje også på små skjermer.
<a href="#display=sb1_component_montgage_prototype">Se også på kompliserte oppsett</a>

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
<fieldset>
  <legend>Hvilken årmodell er din bil?</legend> 
  <div>
    <input type="radio" class="sb1-input-radio" name="car_owner" id="yes_car_owner" data-rule="parent_target[.sb1_input_wrapper]" value="yes" required>
    <label class="sb1_button" id="yes_car_owner_label" for="yes_car_owner"><span>Ja</span></label>        
    <input type="radio" class="sb1-input-radio" name="car_owner" id="no_car_owner" data-rule="parent_target[.sb1_input_wrapper]" value="no" required>
    <label class="sb1_button" id="no_car_owner_label" for="no_car_owner"><span>Nei</span></label>
    <input type="radio" class="sb1-input-radio" name="car_owner" id="dont_know_car_owner" data-rule="parent_target[.sb1_input_wrapper]" value="uknow" required>
    <label class="sb1_button" id="dont_know_car_owner_label" for="dont_know_car_owner"><span>Veit ikkje</span></label> 
  </div>
</fieldset>
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
src/images/sb1_radio_selected_label.svg
src/images/sb1_radio_selected_disabled.svg
src/images/sb1_radio_unselected_disabled.svg
src/images/sb1_radio_unselected_error.svg
src/images/sb1_radio_unselected.svg
