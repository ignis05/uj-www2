# uj-www2

Projekt 2 na ćwiczenia z przedmiotu "Techniki WWW".

---

Strona WWW napisana za pomocą angulara, ng-bootstrap i ng-material, wraz z serwerem node.js korzystającym z frameworka express i bazy danych sqlite3.

Strona umożliwia rejestracje lub logowanie, autoryzacja odbywa się za pomocą tokenów umieszczanych w cookies przez serwer. Następnie użytkownik ma możliwość dodania nowego wpisu, lub edycji albo usunięcia któregoś ze swoich istniejących wpisów. Istneje też konto administracyjne (login:administrator, hasło: administrator), które oprócz edycji i usuwania postów wszystkich użytkowników, ma także możliwość otworzenia panelu użytkowników w którym może usuwać konta innych użytkowników.

---

Uruchomienie:

1.  Pobranie repozytorium oraz node.js
2.  Uruchomienie skryptu budującego: `sh ./deploy.sh`

Skrypt zbuduje stronę oraz serwer i uruchomi go pod adresem `http://localhost:3000`
