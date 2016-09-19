id := 
sb1_form_button_primary

range :=
2

name := 
Primær

approved :=
01.12.2014

tag := 
Blå knapp
Videre

teaser :=
<i class="sb1_lib_button_item sb1_lib_button_primary">Neste</i>

detail :=
-d_s 
name := 
Hvordan bruke

description :=
<p>
	Knappestilen skal brukes for det viktigeste/mest sannsynlige neste krittet 
	i et skjermbilde eller seksjon. Typiske eksempler er "Fortsett", "Neste", 
	"Bestill".
</p>
<p>
	Det skal bare benyttes én primærhandling i et gitt skjermbilde eller en 
	gitt seksjon. Alle andre handlingsknapper skal være sekundærhandlinger.
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
<button class="primary-btn">Opprett Spareavtale</button>
<a href="#" role="button" class="primary-btn">Neste</a>
<input class="primary-btn" value="Godkjent" type="submit">
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
background-color: #002776;
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
