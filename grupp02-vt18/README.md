# Exam Assignment, 1dv527

## Projekt beskrivning
Webbsidan: http://c0eea0f2.ngrok.io/pi/ui
ReST API root: http://c0eea0f2.ngrok.io/pi

Min "web thing" är ett inbrottsalarm. För att starta larmet finns en knapp på min raspberry pi. När knappen trycks ned aktiveras larmet och en grön lampa tänds för att visa att larmet aktiverats. Om något rör sig framför sensorn kommer en röd lampa att börja blinka. Den röda lampan blinkar tills dess att larmet har stängts av, då släcks även den gröna lampan för att visa att sensorn är avaktiverad.  

Jag har även skapat en webbsida där man kan se status för om larmet är igång samt att man kan aktivera/avaktivera larmet från webbsidan. Skulle man vara inne på webbsidan när larmet går kommer texten "Intruder alert!" börja blinka.

Detta är vad jag har implementerat i de olika lagren enligt WoT boken:
Jag provade att implementera TLS(HTTPS), men kommenterade sedan ut detta då jag fick felmeddelande "socket hang up" och kunde inte förstå eller hitta någon information om varför jag fick detta felmeddelande.

| Layer:       | Implemented                            |
| ------------ |:--------------------------------------:|
| Access       | HTML, JSON, REST API, WebSockets, HTTP |
| Find         | HATEOAS                                |
| Share        | ~~TLS~~                                |
| Compose      | Web applications                       |

Jag har även använt mig av "Direct-Integration pattern" enligt WoT boken.
