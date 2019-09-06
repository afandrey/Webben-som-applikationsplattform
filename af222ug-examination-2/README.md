# Exam Assignment 2 - Web API

## Installationsguide
1. Jag har kört mongoDB lokalt, se därför till att ha mongoDB installerat lokalt och igång.
2. Installera moduler med _npm install_
3. Starta API:et med _node app.js_ eller _npm start_
4. Följ Postman collection för att testa API:et

## Rapport
1. How have you implemented the idea of HATEOAS in your API? Motivate your choices and how it support the idea of HATEOAS.  
   Jag har implementerat HATEOAS genom att göra "länkar" så att användaren lättare ska kunna navigera sig runt. Eftersom att HATEOAS bygger på att användaren ska kunna navigera i API:et utan att behöva extra dokumentation så tyckte jag detta kändes passande.

2. If your solution should implement multiple representations of the resources. How would you do it?
   Jag tänker att jag kanske skulle låta användaren skicka en _Accept_ header till API:et och sedan få tillbaka svaret i det som _Accept_ headern tillåter/beskriver.

3. Motivate and defend your authentication solution? Why did you choose the one you did? Pros/Cons.
   Jag valde JSONWebToken (JWT) dels för att jag tyckte det var intressant att få lära mig mer om detta efter att det togs upp i teorin, även för att JWT kändes enkelt att implementera och använda och för att man kan välja utgångstid. Till exempel kan man välja att JWT värdet ska ändras efter 10 minuter, skulle attackeraren få tag på din JWT hinner den förmodligen och förhoppningsvis inte göra särskilt mycket innan värdet har ändrats.

   Fördelar:
   - Den är stateless
   - Ingen implementation av databas
   - Enkel att använda
   - JSON har "great language support"
   - Kan användas till flera tjänster (inom ett system)

   Nackdelar:
   - Enkel att dekryptera
   - Om den hemliga nyckeln läcker ut så blottas all känslig information
   - Kan inte "prata" med klienten. Eftersom man inte sparar data om de inloggade klienterna i databasen så är det inte möjligt att identifiera klienten för att sedan skicka meddelande till (prata med) klienterna.

4. Explain how your web hook works.
   Min webhook kommer skicka ut data när ny data skapas (ny catch registreras) i API:et.

5. Since this is your first own web API there are probably things you would solve in an other way looking back at this assignment. Write your thoughts down.
   Möjligtvis spara WebHook adresserna på ett annar sätt, blev lite tidsbrist. Även att man kanske skulle kunna ta bort WebHooks via API:et och inte behöva gå in i JSON filen och radera "manuellt". Skulle göra mer validering när man skapar catches, som när man uppdaterar dom, även här blev det tidsbrist.  
   Kanske ha en admin funktion.

6. Did you do something extra besides the fundamental requirements? Explain them.
   Man kan bara ändra sin egen registrerade data.
   Detta var visserligen valfritt och inget extra krav direkt, men jag valde att använda HTTPS i samband med JWT, eftersom att när man använder dessa tillsammans så kommer all trafik som skickas vara skyddad, utan HTTPS skickas användarnamn och lösenord till servern i klartext, men med HTTPS förblir det krypterat.