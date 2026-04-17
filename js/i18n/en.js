export default {
    app: {
        title: 'Barcode Scanner',
        tagline: 'Scan any barcode for an instant read on the product.'
    },
    status: {
        ready: 'Ready',
        cameraOff: 'Camera off',
        cameraStarting: 'Starting camera…',
        cameraLive: 'Camera live',
        cameraError: 'Camera unavailable',
        apiOffline: 'API offline',
        lookingUp: 'Looking up {code}…',
        searching: 'Searching "{query}"…',
        found: 'Found: {name}',
        notFound: 'Not found',
        detected: '{code} detected',
        lookupFailed: 'Lookup failed',
        searchFailed: 'Search failed',
        results: '{n, plural, one {# result} other {# results}}'
    },
    actions: {
        startCamera: 'Start camera',
        stop: 'Stop',
        close: 'Close',
        backToResults: 'Results',
        rescan: 'Scan again',
        clear: 'Clear',
        clearFilters: 'Clear filters',
        showMore: 'Show more',
        loading: 'Loading…',
        share: 'Share',
        shareCopied: 'Link copied to clipboard',
        install: 'Install app'
    },
    search: {
        placeholder: 'Search by barcode or product name',
        onlyBarcodes: 'Text search unavailable. Enter a barcode (8–14 digits).',
        barcodeOnly: 'Barcodes only',
        sortBy: 'Sort',
        nutriScore: 'Nutri-Score',
        sortOptions: {
            relevance: 'Most relevant',
            nameAsc: 'Name (A–Z)',
            nameDesc: 'Name (Z–A)',
            scoreAsc: 'Nutri-Score (best first)',
            scoreDesc: 'Nutri-Score (worst first)'
        }
    },
    results: {
        titleN: '{total} {noun} for "{query}"',
        titleFilteredN: '{total} {noun} for "{query}" with Nutri-Score {grades}',
        resultSingular: 'result',
        resultPlural: 'results',
        noMatches: 'No matches for "{query}"',
        noFilterMatches: 'No matches for "{query}" with these filters',
        loadedOfTotal: '{loaded} of {total} loaded',
        allLoaded: 'All {loaded} loaded',
        emptyFiltered: 'No results match your filters.'
    },
    empty: {
        title: 'Scan a product',
        body: 'Point the camera at a barcode, or type one in the search bar above. Results appear here.',
        recent: 'Recently viewed',
        credit: 'Made by'
    },
    product: {
        unknownBrand: 'Unknown brand',
        noImage: 'No image',
        imageUnavailable: 'Image unavailable',
        imageFront: 'Front',
        imageIngredients: 'Ingredients',
        imageNutrition: 'Nutrition',
        imagePackaging: 'Packaging',
        scansN: '{n} scans',
        completenessN: '{n}% complete',
        updatedAt: 'Updated {when}',
        updatedToday: 'today',
        updatedDaysAgo: '{n}d ago',
        updatedMonthsAgo: '{n}mo ago',
        updatedYearsAgo: '{n}y ago'
    },
    scores: {
        sectionLabel: 'Scores',
        nutriScore: 'Nutri-Score',
        nova: 'NOVA (processing)',
        ecoScore: 'Eco-Score',
        nutriVerdicts: {
            A: 'Excellent nutritional quality',
            B: 'Good nutritional quality',
            C: 'Average nutritional quality',
            D: 'Poor nutritional quality',
            E: 'Bad nutritional quality'
        },
        novaNotes: {
            1: 'Unprocessed',
            2: 'Culinary ingredient',
            3: 'Processed',
            4: 'Ultra-processed'
        }
    },
    verdict: {
        great: { label: 'Excellent choice' },
        good: { label: 'Good choice' },
        okay: { label: 'Average choice' },
        poor: { label: 'Look closer' },
        bad: { label: 'Unhealthy choice' },
        unknown: { label: 'Not enough data' },
        reasons: {
            ultraProcessed: 'Ultra-processed',
            highSugar: 'High in sugar',
            highFat: 'High in fat',
            highSatFat: 'High in saturated fat',
            highSalt: 'High in salt',
            palmOil: 'Contains palm oil',
            allergens: 'Allergens: {list}',
            vegan: 'Vegan',
            vegetarian: 'Vegetarian',
            palmOilFree: 'Palm-oil free',
            lowSugar: 'Low sugar',
            lowFat: 'Low fat',
            lowSalt: 'Low salt',
            organic: 'Organic',
            glutenFree: 'Gluten-free',
            default: {
                good: 'Good nutritional quality',
                okay: 'Average nutritional quality',
                missing: 'Not enough information available'
            }
        }
    },
    nutrition: {
        per100g: 'Per 100 g',
        perServing: 'Per serving ({size})',
        perServingShort: 'Per serving',
        labels: {
            'energy-kcal': 'Energy',
            fat: 'Fat',
            'saturated-fat': 'Saturated fat',
            carbohydrates: 'Carbohydrates',
            sugars: 'Sugars',
            fiber: 'Fiber',
            proteins: 'Protein',
            salt: 'Salt'
        },
        levels: {
            low: 'low',
            moderate: 'moderate',
            high: 'high'
        }
    },
    allergens: {
        title: 'Contains',
        traces: 'May contain traces: {list}'
    },
    ingredients: {
        title: 'Ingredients'
    },
    analysis: {
        palmOil: 'Palm oil',
        palmOilFree: 'Palm-oil free',
        vegan: 'Vegan',
        nonVegan: 'Not vegan',
        vegetarian: 'Vegetarian',
        nonVegetarian: 'Not vegetarian'
    },
    labels: {
        organic: 'Organic',
        glutenFree: 'Gluten-free',
        lactoseFree: 'Lactose-free',
        sugarFree: 'Sugar-free',
        noPreservatives: 'No preservatives',
        noColorings: 'No colorings',
        fairTrade: 'Fair trade',
        halal: 'Halal',
        kosher: 'Kosher',
        noAddedSugar: 'No added sugar',
        bio: 'Organic'
    },
    errors: {
        cameraBlocked: 'Camera blocked or unavailable',
        apiUnreachable: 'Open Food Facts is unreachable right now',
        lookupFailed: 'Lookup failed — check your connection',
        searchFailed: 'Search failed — try again',
        shareNotSupported: 'Sharing is not supported in this browser'
    },
    hints: {
        tapStart: 'Press Start to open the camera'
    }
}