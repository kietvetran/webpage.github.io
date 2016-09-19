id := 
sb1_wizard_step_couter

name := 
Stegteller

approved :=

tag := 
wizard
counter
step by step
teller

teaser :=
<i class="sb1_lib_wizard_step_counter"></i>


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

iframe :=
{PATH}/index.html

-d_e
-d_s
name :=
HTML-kode

code :=
<div class="sb1_step_counter">
	<h3>Steg 3 av 7</h3>
	<div class="sb1_progress">  	
    <div class="bar" role="progressbar" aria-valuenow="3" aria-valuemin="1" aria-valuemax="7" style="width:43%">
      <span class="sr">Steg 3 av 7</span>
    </div>
  </div>
</div>
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
src/less/common/sb1_step_counter.less