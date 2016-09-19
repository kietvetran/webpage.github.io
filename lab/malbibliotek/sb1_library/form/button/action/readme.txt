id := 
sb1_form_button_action

range :=
1

name := 
Handlingsoppfordring

approved :=
01.12.2014

tag := 
CTA
Call to action
Handling
Handlingsknapp
Grønn knapp


teaser :=
<i class="sb1_lib_button_item sb1_lib_button_action">Kjøp</i>

detail :=
-d_s 
name := 
Hvordan bruke

description :=
<p>
	Knappen skal brukes for å påbegynne en kjøpsprosess, og ingen andre steder. 
	Teksen bør være verb i imperativsform - eks. "Kjøp nå" ikke "begynne å kjøpe".
</p>
<p>
	Man kan ha flere calls-to-action i en side eller seksjon. For eksempel en 
	call-to-action for hver av tre ulike pakker. Man bør imidlertid begrense 
	bruken av disse mest mulig - de er mer effektive, jo færre man har.
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
<button class="action-btn">Kjøpp</button>
<a href="#" role="button" class="action-btn">Logg inn</a>
<input class="action-btn" value="Bestill" type="submit">
-d_e

-d_s
name :=
CSS-kode

code :=
border-radius: 4px;
color: white;
cursor: pointer;
font-family: "MuseoSansRounded-700";
font-size: 18px;
line-height: 22px;
padding: 14px 30px;
text-align: center;
text-decoration: none;
background-color: #005aa4;
-d_e

directory_depending :=
src/fonts
src/bootstrap
src/icons

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
