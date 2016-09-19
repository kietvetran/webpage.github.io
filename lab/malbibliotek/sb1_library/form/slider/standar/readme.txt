id := 
sb1_form_slider_standard

range :=
1

name := 
Slider knapp

approved :=

tag := 

teaser :=
<i class="sb1_lib_slider"></i>

detail :=
-d_s 
name := 
Hvordan bruke

description :=
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin cursus tortor sed nisl tincidunt, vitae efficitur elit congue.

-d_e
-d_s
name :=
Demo

tab :=
-t_s
name :=
Skala [0-100]

iframe :=
{PATH}/slider_button.html
-t_e
-t_s
name :=
Skala [150-210]

iframe :=
{PATH}/slider_button2.html
-t_e
-d_e

-d_s
name :=
HTML-kode

code :=
<div role="application" class="sb1_slider_wrapper">
    <div id="volum_label" class="sb1_slider_label">Volum justering</div>
    <div id="sr1" class="sb1_slider_track">
        <a tabindex="0" aria-controls="sr1_text" aria-labelledby="volum_label" aria-valuenow="0" aria-valuemax="100" aria-valuemin="0" role="slider" class="sb1_slider_btn">0</a>
        <span class="sb1_slider_tail"></span>
    </div>
</div>
-d_e

-d_s
name :=
LESS-avhengighet

code :=
sb1_dropdwon_menu.less
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
src/less/common/form.less
src/less/common/sb1_form_validation.less
src/less/common/sb1_slider_button.less

js_depending :=
src/js/jquery/1.11.2.jquery.min.js
src/js/plugins/sb1_slider_button.js
src/js/plugins/sb1_form_validation.js