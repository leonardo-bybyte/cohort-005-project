# Confronto dei servizi esterni per Notification in-app

Ticket: [#3](https://github.com/leonardo-bybyte/cohort-005-project/issues/3) · Mappa: [#1](https://github.com/leonardo-bybyte/cohort-005-project/issues/1)
Fonti consultate il **2026-11-10**. Prezzi e piani cambiano spesso: ricontrollare prima della scelta.

## Domanda

Quali servizi esterni possono gestire le **Notification** in-app di Cadence (per Student e Instructor), e come si confrontano su componenti React, costo, open source / self-host, residenza dei dati in UE, real-time e lock-in?

Contesto Cadence: React 19 (`react@^19.2.7`), React Router 8 (`react-router@8.3.0`), server Node, un solo file SQLite. Solo in-app: email e push sono fuori scope.

Servizi valutati: **Knock**, **Novu**, **MagicBell**, **Courier**, **SuprSend**.

## Tabella di confronto

| Criterio | Knock | Novu | MagicBell | Courier | SuprSend |
| --- | --- | --- | --- | --- | --- |
| Pacchetto React per l'inbox | `@knocklabs/react` 0.15.1 | `@novu/react` 3.19.2 | `@magicbell/react` 1.14.0 | `@trycourier/courier-react` 9.3.5 | `@suprsend/react` 1.5.0 (e `@suprsend/react-inbox` 3.9.0) |
| Compatibilità React 19 (peerDependencies) | Sì: `^17 \|\| ^18 \|\| ^19` | Sì: `^18 \|\| ^19` | Non dichiarata su `@magicbell/react`; il vecchio `@magicbell/magicbell-react` chiede `>= 18.3.1` | Sì: `>=18.0.0` | Sì: `>= 16.8.0` (range aperto) |
| Licenza SDK React | MIT | ISC | Non dichiarata su npm (vecchio pacchetto: "SEE LICENSE") | MIT | MIT |
| Piano gratuito | 10.000 messaggi/mese | 10.000 workflow run/mese, **retention feed 24 ore** | 1.000 consegne/mese | 10.000 invii/mese | 10.000 notifiche/mese, con branding SuprSend nel feed |
| Primo piano a pagamento | Starter $250/mese, 50.000 messaggi, poi $0,005 l'uno | Pro da $30/mese, 30.000+ run, retention feed 7 giorni; extra $1,20 ogni 1.000 | Startup $249/mese, 50.000 consegne, poi $0,0025 l'una | Business a consumo, $0,005 per invio | Essentials $100/mese, 50.000 notifiche, poi $2 ogni 1.000 |
| Piano "medio" | Enterprise (su richiesta) | Team da $250/mese, 250.000+ run, retention feed 90 giorni | Enterprise (su richiesta) | Enterprise (su richiesta) | Business $250/mese, 50.000 notifiche, poi $5 ogni 1.000 (aggiunge preferenze utente, digest) |
| Open source | No | Sì, open core: core MIT, cartella `enterprise` con licenza commerciale | No | No | No |
| Self-host | No | Sì: Community Edition (MongoDB + Redis + servizi API/Worker/WS); offerta on-prem Enterprise | No (non menzionato) | No (non menzionato) | Solo Enterprise (self-host e BYOC, quest'ultimo in beta) |
| Residenza dati UE | **Non ancora**: "atteso entro fine 2026" | Sì, anche sul piano Free (regione UE, Francoforte) | **Non verificato**: GDPR e DPA dichiarati, regione di hosting non indicata | Sì, datacenter UE (Irlanda): sul pricing è nel piano Business, nei docs "su richiesta" | Sì secondo pagina Enterprise (US o UE); sul pricing la regione custom è solo Enterprise |
| Real-time | WebSocket | WebSocket (PartySocket in cloud, socket.io in self-host) | WebSocket | Real-time (host `wss://realtime...` nei docs) | WebSocket (secondo tutorial SuprSend) |
| Lock-in / accesso ai dati | Feeds API per utente; nessun export massivo documentato | Con self-host i dati stanno nel proprio MongoDB; API REST | REST API; export massivo non verificato | REST API; export massivo non verificato | REST API; export massivo non verificato; log sync verso data warehouse nel piano Business |

## Stima dei costi per volume

Il volume reale di Cadence **non è noto**. Scenari indicativi, solo canale in-app, prezzi di listino mensili:

| Notification/mese | Knock | Novu | MagicBell | Courier | SuprSend |
| --- | --- | --- | --- | --- | --- |
| 5.000 | $0 | $0 (ma feed tenuto solo 24 ore) | $249 (Free arriva a 1.000) | $0 | $0 (con branding) |
| 50.000 | $250 | ~$54 (Pro: $30 + 20k × $1,20/1k; retention 7 giorni) | $249 | ~$250 (se tutti gli invii sono a $0,005; non verificato se i primi 10k restano gratis) | $100 (Essentials) |
| 250.000 | ~$1.250 | ~$250 (Team, retention 90 giorni) | ~$749 | ~$1.250 | ~$500 (Essentials) / ~$1.250 (Business) |

Note:

- Le unità di misura sono diverse: Knock conta "messaggi", Novu "workflow run", MagicBell "consegne", Courier "invii", SuprSend "notifiche". Per una Notification solo in-app a un destinatario sono più o meno equivalenti, ma non è garantito.
- Novu calcola il prezzo "da"; le soglie esatte del Pro sopra 30.000 run non sono visibili sulla pagina.
- La **retention del feed** su Novu dipende dal piano (24 ore / 7 giorni / 90 giorni). Per gli altri servizi la retention del feed non è indicata nelle pagine lette.

## Trade-off (sintesi neutrale)

- **Knock**: SDK React maturo con React 19 dichiarato, real-time via WebSocket. Costo alto appena si supera il Free ($250/mese). Manca oggi la residenza dati in UE (promessa entro fine 2026). Nessun self-host.
- **Novu**: unico open source e self-hostabile; regione UE anche sul Free. Prezzo basso al crescere del volume. Svantaggi: retention del feed molto corta sui piani bassi; il self-host richiede MongoDB e Redis, cioè infrastruttura in più rispetto al singolo SQLite di Cadence.
- **MagicBell**: componenti React pronti, WebSocket. Free molto piccolo (1.000) e salto diretto a $249. Residenza UE e compatibilità React 19 del nuovo pacchetto non dichiarate.
- **Courier**: SDK React per React 18+, prezzo a consumo semplice, datacenter UE. Ambiguità su quale piano include l'UE (pricing: Business; docs: su richiesta). Nessun self-host.
- **SuprSend**: il più economico a volume medio (Essentials), SDK con range React aperto. Branding sul Free; preferenze utente solo da Business; residenza UE e self-host chiaramente garantiti solo su Enterprise.

Questo documento **non** fa la scelta: è il compito di [#4](https://github.com/leonardo-bybyte/cohort-005-project/issues/4).

## Non verificato

- **MagicBell**: regione di hosting dei dati (UE o no); licenza e peerDependencies di `@magicbell/react` (npm non le riporta).
- **Courier**: se la regione UE è self-service sul piano Business o va attivata dal supporto (fonti ufficiali in conflitto); se i primi 10.000 invii restano gratuiti sul Business.
- **SuprSend**: residenza UE fuori dal piano Enterprise; dettagli del trasporto real-time presi da un tutorial, non dalla reference SDK.
- **Tutti**: export massivo dei dati (oltre alle API di lettura) e retention del feed (tranne Novu).
- **Compatibilità con React Router 8 e SSR**: nessun servizio la documenta esplicitamente. I peerDependencies dicono solo che React 19 è accettato. Va provata con un prototipo.
- Volume reale di Notification di Cadence: serve per una stima di costo vera.

## Fonti

Tutte consultate il 2026-11-10.

Prezzi:

- Knock: https://knock.app/pricing
- Novu: https://novu.co/pricing
- MagicBell: https://www.magicbell.com/pricing
- Courier: https://www.courier.com/pricing
- SuprSend: https://www.suprsend.com/pricing

SDK React (registry npm, via `npm view <pacchetto> version peerDependencies license`):

- https://www.npmjs.com/package/@knocklabs/react
- https://www.npmjs.com/package/@novu/react
- https://www.npmjs.com/package/@magicbell/react
- https://www.npmjs.com/package/@magicbell/magicbell-react
- https://www.npmjs.com/package/@trycourier/courier-react
- https://www.npmjs.com/package/@suprsend/react
- https://www.npmjs.com/package/@suprsend/react-inbox

Residenza dati, real-time, self-host:

- Knock, piani e roadmap UE: https://docs.knock.app/manage-your-account/knock-plans
- Knock, feed in-app e WebSocket: https://docs.knock.app/in-app-ui/feeds/overview
- Knock, privacy policy (DPF, SCC): https://knock.app/legal/privacy-policy
- Novu, repository e licenza: https://github.com/novuhq/novu
- Novu, self-hosting: https://docs.novu.co/community/self-hosting-novu/overview
- Novu, Community vs Cloud: https://docs.novu.co/community/self-hosted-and-novu-cloud
- Novu, servizio WebSocket in locale: https://docs.novu.co/community/run-in-local-machine
- Novu, `@novu/js` (socketType): https://docs.novu.co/platform/sdks/javascript
- MagicBell, componenti React: https://www.magicbell.com/docs/libraries/magicbell-react
- MagicBell, canale in-app: https://www.magicbell.com/docs/channels/in_app
- MagicBell, trust centre: https://www.magicbell.com/security
- Courier, Inbox: https://www.courier.com/docs/platform/inbox/inbox-overview
- Courier, datacenter UE: https://courier.com/docs/platform/workspaces/eu-datacenter
- Courier, blog sulla residenza UE (fonte di un concorrente per Knock/Novu/SuprSend, usata solo come conferma): https://www.courier.com/blog/eu-data-residency-notifications
- SuprSend, Enterprise (US/UE): https://www.suprsend.com/enterprise
- SuprSend, sicurezza: https://docs.suprsend.com/docs/security
- SuprSend, self-host: https://www.suprsend.com/self-host
- SuprSend, tutorial (WebSocket): https://www.suprsend.com/post/notification-system-tutorial
