id := 
sb1_form_dropdown_menu_type1

range :=
1

name := 
Dropdown meny type1

approved :=

tag :=
menu
list
option
valg
forslag
alternative
søk
search

teaser :=
<i class="sb1_lib_dropdown_menu"></i>

detail :=
-d_s 
name := 
Hvordan bruke

description :=
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eleifend dapibus tempor. Curabitur vestibulum commodo 

-d_e
-d_s
name :=
Demo

tab :=
-t_s
name :=
Normal

iframe :=
{PATH}/index.html
-t_e
-t_s
name :=
Konto

iframe :=
{PATH}/account.html
-t_e

-t_s
name :=
Søk

iframe :=
{PATH}/search.html
-t_e
-d_e
-d_s
name :=
HTML-kode

code :=
<div class="sb1_dropdown_menu">
  <a role="button" aria-controls="insurance_start_date_list" href="#" class="sb1_dropdown_btn">Desember</a>
  <input name="current_insurance_company" aria-hidden="true" required="" type="hidden">
  <ul role="listbox" id="insurance_start_date_list" aria-expanded="false" class="sb1_dropdown_list">
    <li class="sb1_dropdown_option" role="option">Januar</li>
    <li class="sb1_dropdown_option" role="option">Februar</li>
    <li class="sb1_dropdown_option" role="option">Mars</li>
    <li class="sb1_dropdown_option" role="option">April</li>
    <li class="sb1_dropdown_option" role="option">Mai</li>
    <li class="sb1_dropdown_option" role="option">Juni</li>
    <li class="sb1_dropdown_option" role="option">Juli</li>
    <li class="sb1_dropdown_option" role="option">August</li>
    <li class="sb1_dropdown_option" role="option">September</li>
    <li class="sb1_dropdown_option" role="option">Oktober</li>
    <li class="sb1_dropdown_option" role="option">November</li>
    <li class="sb1_dropdown_option selected" role="option">Desember</li>
  </ul>
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
src/less/common/sb1_dropdown_menu.less

js_depending :=
src/js/jquery/1.8.3.jquery.js
src/js/plugins/sb1_dropdown_menu.js

image_depending :=
src/images/active_list_arrow.svg
src/images/normal_list_arrow.svg
src/images/sb1_dropdown_menu_search_inactive.svg
src/images/sb1_dropdown_menu_search_active.svg
src/images/sb1_checkmark_blue.svg
