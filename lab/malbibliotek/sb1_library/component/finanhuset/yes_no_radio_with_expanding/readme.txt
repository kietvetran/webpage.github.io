id := 
sb1_component_yes_no_later_radio_with_expanding

range :=
99

name :=
Ja / Nei / Senere med ekspandering

approved :=

tag :=

teaser :=
<i class="sb1_lib_yes_no_later_button"></i>

detail :=
-d_s 
name := 
Hvordan bruke

description :=
<p>
Dette er en oppsalgsmodul som består av ett tipselement samt en knapperad for om 
brukeren skal gjøre det nå (ja), ikke nå/aldri (nei) eller legge i huskelisten til senere (senere). 
</p>
<p>
<span style="text-decoration:underline;display:block">Velg "Ja"</span>
<span>
	Hvis brukeren klikker på “Ja” skal hen få bestille produktet så raskt som mulig. 
	Hvor raskt vil være avhengig av hvor mange ekstra felter brukeren må fylle ut. 
	Mange av brukerne som klikker “Ja” til et produkt som krever en egen skjemaprosess 
	vil ha en forventing om at noe skal skje med en gang. 
	(De har tross alt takket ja til å bestille et produkt). I mange tilfeller kan det 
	derfor være lurt å vise en melding som forklarer prosessen videre.
</span>
</p>
<p>
<span style="text-decoration:underline;display:block">Velg "Nei"</span>
<span>
Hvis brukeren klikker på “Nei” skal ingenting skje. Selv om denne knappen ikke har noen 
teknisk funksjon skal den aldri kuttes ut i forbindelse med oppsalg. Det er etisk og prinsipelt 
svært viktig at kunden opplever at de kan si tydelig nei til et oppsalg. 
</span>
</p>
<p>
<span style="text-decoration:underline;display:block">Velg "Senere"</span>
<span>
Hvis brukeren klikker på “Senere” så vil produktet dukke opp i huskelisten. 
Brukeren får dermed mulighet til å bestille produktet på et senere tidspunkt.
</span>
</p>


-d_e
-d_s
name :=
Demo

iframe :=
{PATH}/index.html
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
src/less/mixins/icon-circle.less
src/less/common/icon-font.less
src/less/common/icons.less
src/less/common/buttons.less
src/less/common/sb1_input_radio.less
src/less/common/form.less
src/less/common/typography.less
src/less/common/sb1_form_validation.less
src/less/common/sb1_form_row.less
src/less/components/tip.less

js_depending :=
src/js/jquery/1.11.2.jquery.min.js
src/js/plugins/sb1_form_row.js
src/js/plugins/sb1_form_validation.js
src/js/plugins/sb1_radio_yes_no_button.js

image_depending :=
src/images/information.svg
src/images/sb1_radio_focus.svg
src/images/sb1_radio_selected.svg
src/images/sb1_radio_selected_label.svg
src/images/sb1_radio_selected_disabled.svg
src/images/sb1_radio_unselected_disabled.svg
src/images/sb1_radio_unselected_error.svg
src/images/sb1_radio_unselected.svg

icon_depending :=
src/icons/tips.svg
src/icons/arrow_down.svg
src/icons/arrow_up.svg
