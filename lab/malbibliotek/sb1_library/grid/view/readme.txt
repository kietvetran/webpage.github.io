id := 
sb1_grid_view

range :=
1

name := 
Grid stil

approved :=
01.12.2014

tag := 
layout

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
<div class="container">
  <div class="row">
    <div class="col-md-4">.col-md-4</div>
    <div class="col-md-4 col-md-offset-4">.col-md-4 .col-md-offset-4</div>
  </div>
  <div class="row">
    <div class="col-md-3 col-md-offset-3">.col-md-3 .col-md-offset-3</div>
    <div class="col-md-3 col-md-offset-3">.col-md-3 .col-md-offset-3</div>
  </div>
  <div class="row">
    <div class="col-md-6 col-md-offset-3">.col-md-6 .col-md-offset-3</div>
  </div>
  <div class="row">
    <div class="col-md-12">.col-md-12</div>
  </div>
  <div class="row">
    <div class="col-md-10 col-md-offset-1">.col-md-10 .col-md-offset-1</div>
  </div>
</div>
-d_e

-d_s
name :=
CSS-avhengighet

code :=
Bootstrap v3.3.1
-d_e

directory_depending :=
src/fonts
src/bootstrap

less_import :=
../bootstrap/less/variables.less
../bootstrap/less/mixins.less
../bootstrap/less/normalize.less
../bootstrap/less/grid.less

less_depending :=
src/less/common/variables.less
src/less/mixins/fontface.less
src/less/common/typography.less
