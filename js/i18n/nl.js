export default {
    app: {
        title: 'Barcode Scanner',
        tagline: 'Scan een barcode en zie direct wat je vasthoudt.'
    },
    status: {
        ready: 'Gereed',
        cameraOff: 'Camera uit',
        cameraStarting: 'Camera starten…',
        cameraLive: 'Camera actief',
        cameraError: 'Camera niet beschikbaar',
        apiOffline: 'API offline',
        lookingUp: '{code} opzoeken…',
        searching: 'Zoeken naar "{query}"…',
        found: 'Gevonden: {name}',
        notFound: 'Niet gevonden',
        detected: '{code} gedetecteerd',
        lookupFailed: 'Opzoeken mislukt',
        searchFailed: 'Zoeken mislukt',
        results: '{n, plural, one {# resultaat} other {# resultaten}}'
    },
    actions: {
        startCamera: 'Start camera',
        stop: 'Stop',
        close: 'Sluiten',
        backToResults: 'Resultaten',
        rescan: 'Opnieuw scannen',
        clear: 'Leegmaken',
        clearFilters: 'Wis filters',
        showMore: 'Toon meer',
        loading: 'Laden…',
        share: 'Delen',
        shareCopied: 'Link gekopieerd',
        install: 'Installeer app'
    },
    search: {
        placeholder: 'Zoek op barcode of productnaam',
        onlyBarcodes: 'Tekst zoeken is niet beschikbaar. Vul een barcode in (8–14 cijfers).',
        barcodeOnly: 'Alleen barcodes',
        sortBy: 'Sorteer',
        nutriScore: 'Nutri-Score',
        sortOptions: {
            relevance: 'Meest relevant',
            nameAsc: 'Naam (A–Z)',
            nameDesc: 'Naam (Z–A)',
            scoreAsc: 'Nutri-Score (beste eerst)',
            scoreDesc: 'Nutri-Score (slechtste eerst)'
        }
    },
    results: {
        titleN: '{total} {noun} voor "{query}"',
        titleFilteredN: '{total} {noun} voor "{query}" met Nutri-Score {grades}',
        resultSingular: 'resultaat',
        resultPlural: 'resultaten',
        noMatches: 'Geen resultaten voor "{query}"',
        noFilterMatches: 'Geen resultaten voor "{query}" met deze filters',
        loadedOfTotal: '{loaded} van {total} geladen',
        allLoaded: 'Alle {loaded} geladen',
        emptyFiltered: 'Geen resultaten voldoen aan je filters.'
    },
    empty: {
        title: 'Scan een product',
        body: 'Richt de camera op een barcode, of vul er hierboven één in. Het resultaat verschijnt hier.',
        recent: 'Recent bekeken',
        credit: 'Gemaakt door'
    },
    product: {
        unknownBrand: 'Merk onbekend',
        noImage: 'Geen afbeelding',
        imageUnavailable: 'Afbeelding niet beschikbaar',
        imageFront: 'Voorkant',
        imageIngredients: 'Ingrediënten',
        imageNutrition: 'Voedingswaarden',
        imagePackaging: 'Verpakking',
        scansN: '{n} scans',
        completenessN: '{n}% compleet',
        updatedAt: 'Bijgewerkt {when}',
        updatedToday: 'vandaag',
        updatedDaysAgo: '{n}d geleden',
        updatedMonthsAgo: '{n}mnd geleden',
        updatedYearsAgo: '{n}jr geleden'
    },
    scores: {
        sectionLabel: 'Scores',
        nutriScore: 'Nutri-Score',
        nutriUnavailable: 'Niet beschikbaar',
        nova: 'NOVA (bewerkingsgraad)',
        ecoScore: 'Eco-Score',
        nutriVerdicts: {
            A: 'Uitstekende voedingskwaliteit',
            B: 'Goede voedingskwaliteit',
            C: 'Gemiddelde voedingskwaliteit',
            D: 'Matige voedingskwaliteit',
            E: 'Slechte voedingskwaliteit'
        },
        novaNotes: {
            1: 'Onbewerkt',
            2: 'Culinair ingrediënt',
            3: 'Bewerkt',
            4: 'Ultrabewerkt'
        }
    },
    verdict: {
        great: { label: 'Uitstekende keuze' },
        good: { label: 'Goede keuze' },
        okay: { label: 'Matige keuze' },
        poor: { label: 'Bekijk kritisch' },
        bad: { label: 'Ongezonde keuze' },
        unknown: { label: 'Onvoldoende data' },
        reasons: {
            ultraProcessed: 'Ultrabewerkt',
            highSugar: 'Veel suiker',
            highFat: 'Veel vet',
            highSatFat: 'Veel verzadigd vet',
            highSalt: 'Veel zout',
            palmOil: 'Bevat palmolie',
            allergens: 'Allergenen: {list}',
            vegan: 'Veganistisch',
            vegetarian: 'Vegetarisch',
            palmOilFree: 'Palmolievrij',
            lowSugar: 'Weinig suiker',
            lowFat: 'Weinig vet',
            lowSalt: 'Weinig zout',
            organic: 'Biologisch',
            glutenFree: 'Glutenvrij',
            default: {
                good: 'Goede voedingskwaliteit',
                okay: 'Matige voedingskwaliteit',
                missing: 'Niet genoeg informatie beschikbaar'
            }
        }
    },
    nutrition: {
        per100g: 'Per 100 g',
        per100ml: 'Per 100 ml',
        perServing: 'Per portie ({size})',
        perServingShort: 'Per portie',
        labels: {
            'energy-kcal': 'Energie',
            fat: 'Vet',
            'saturated-fat': 'Verzadigd vet',
            carbohydrates: 'Koolhydraten',
            sugars: 'Suikers',
            fiber: 'Vezels',
            proteins: 'Eiwitten',
            salt: 'Zout'
        },
        levels: {
            low: 'laag',
            moderate: 'gemiddeld',
            high: 'hoog'
        }
    },
    allergens: {
        title: 'Bevat',
        traces: 'Kan sporen bevatten: {list}'
    },
    ingredients: {
        title: 'Ingrediënten'
    },
    analysis: {
        palmOil: 'Palmolie',
        palmOilFree: 'Palmolievrij',
        vegan: 'Veganistisch',
        nonVegan: 'Niet veganistisch',
        vegetarian: 'Vegetarisch',
        nonVegetarian: 'Niet vegetarisch'
    },
    labels: {
        organic: 'Biologisch',
        glutenFree: 'Glutenvrij',
        lactoseFree: 'Lactosevrij',
        sugarFree: 'Suikervrij',
        noPreservatives: 'Zonder conservatieringsmiddelen',
        noColorings: 'Zonder kleurstoffen',
        fairTrade: 'Fairtrade',
        halal: 'Halal',
        kosher: 'Koosjer',
        noAddedSugar: 'Zonder toegevoegde suiker',
        bio: 'Biologisch'
    },
    errors: {
        cameraBlocked: 'Camera geblokkeerd of niet beschikbaar',
        apiUnreachable: 'Open Food Facts is nu niet bereikbaar',
        lookupFailed: 'Opzoeken mislukt — controleer je verbinding',
        searchFailed: 'Zoeken mislukt — probeer opnieuw',
        shareNotSupported: 'Delen wordt niet ondersteund in deze browser'
    },
    hints: {
        tapStart: 'Zoek een product op naam of barcode'
    }
}