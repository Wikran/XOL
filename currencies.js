// Currency List and Divisions List
const aCurrenciesList =  [
          { "name": "United States Dollar", "code": "USD", "symbol": "$" },
          { "name": "Euro", "code": "EUR", "symbol": "€" },
          { "name": "Japanese Yen", "code": "JPY", "symbol": "¥" },
          { "name": "British Pound Sterling", "code": "GBP", "symbol": "£" },
          { "name": "Australian Dollar", "code": "AUD", "symbol": "A$" },
          { "name": "Canadian Dollar", "code": "CAD", "symbol": "C$" },
          { "name": "Swiss Franc", "code": "CHF", "symbol": "CHF" },
          { "name": "Chinese Yuan Renminbi", "code": "CNY", "symbol": "¥" },
          { "name": "Swedish Krona", "code": "SEK", "symbol": "kr" },
          { "name": "New Zealand Dollar", "code": "NZD", "symbol": "NZ$" },
          { "name": "Mexican Peso", "code": "MXN", "symbol": "$" },
          { "name": "Singapore Dollar", "code": "SGD", "symbol": "S$" },
          { "name": "Hong Kong Dollar", "code": "HKD", "symbol": "HK$" },
          { "name": "Norwegian Krone", "code": "NOK", "symbol": "kr" },
          { "name": "South Korean Won", "code": "KRW", "symbol": "₩" },
          { "name": "Turkish Lira", "code": "TRY", "symbol": "₺" },
          { "name": "Russian Ruble", "code": "RUB", "symbol": "₽" },
          { "name": "Indian Rupee", "code": "INR", "symbol": "₹" },
          { "name": "Brazilian Real", "code": "BRL", "symbol": "R$" },
          { "name": "South African Rand", "code": "ZAR", "symbol": "R" },
          { "name": "Philippine Peso", "code": "PHP", "symbol": "₱" },
          { "name": "Czech Koruna", "code": "CZK", "symbol": "Kč" },
          { "name": "Indonesian Rupiah", "code": "IDR", "symbol": "Rp" },
          { "name": "Malaysian Ringgit", "code": "MYR", "symbol": "RM" },
          { "name": "Hungarian Forint", "code": "HUF", "symbol": "Ft" },
          { "name": "Icelandic Krona", "code": "ISK", "symbol": "kr" },
          { "name": "Croatian Kuna", "code": "HRK", "symbol": "kn" },
          { "name": "Bulgarian Lev", "code": "BGN", "symbol": "лв" },
          { "name": "Romanian Leu", "code": "RON", "symbol": "lei" },
          { "name": "Danish Krone", "code": "DKK", "symbol": "kr" },
          { "name": "Thai Baht", "code": "THB", "symbol": "฿" },
          { "name": "Polish Zloty", "code": "PLN", "symbol": "zł" },
          { "name": "Israeli Shekel", "code": "ILS", "symbol": "₪" },
          { "name": "Chilean Peso", "code": "CLP", "symbol": "$" },
          { "name": "Pakistani Rupee", "code": "PKR", "symbol": "₨" },
          { "name": "Colombian Peso", "code": "COP", "symbol": "$" },
          { "name": "Saudi Riyal", "code": "SAR", "symbol": "﷼" },
          { "name": "Argentine Peso", "code": "ARS", "symbol": "$" },
          { "name": "Ukrainian Hryvnia", "code": "UAH", "symbol": "₴" },
          { "name": "Vietnamese Dong", "code": "VND", "symbol": "₫" },
          { "name": "Egyptian Pound", "code": "EGP", "symbol": "£" },
          { "name": "Bangladeshi Taka", "code": "BDT", "symbol": "৳" },
          { "name": "Peruvian Sol", "code": "PEN", "symbol": "S/." },
          { "name": "Kazakhstani Tenge", "code": "KZT", "symbol": "₸" },
          { "name": "Nigerian Naira", "code": "NGN", "symbol": "₦" },
          { "name": "Moroccan Dirham", "code": "MAD", "symbol": "د.م." },
          { "name": "Sri Lankan Rupee", "code": "LKR", "symbol": "₨" },
          { "name": "Kenyan Shilling", "code": "KES", "symbol": "KSh" },
          { "name": "Tunisian Dinar", "code": "TND", "symbol": "د.ت" },
          { "name": "Ghanaian Cedi", "code": "GHS", "symbol": "₵" },
          { "name": "Omani Rial", "code": "OMR", "symbol": "﷼" },
          { "name": "Qatari Riyal", "code": "QAR", "symbol": "﷼" },
          { "name": "Kuwaiti Dinar", "code": "KWD", "symbol": "د.ك" },
          { "name": "Bahraini Dinar", "code": "BHD", "symbol": "ب.د" },
          { "name": "Jordanian Dinar", "code": "JOD", "symbol": "د.ا" },
          { "name": "Lebanese Pound", "code": "LBP", "symbol": "ل.ل" },
          { "name": "Syrian Pound", "code": "SYP", "symbol": "£" },
          { "name": "Iraqi Dinar", "code": "IQD", "symbol": "ع.د" },
          { "name": "Libyan Dinar", "code": "LYD", "symbol": "ل.د" },
          { "name": "Sudanese Pound", "code": "SDG", "symbol": "£" },
          { "name": "Algerian Dinar", "code": "DZD", "symbol": "د.ج" },
          { "name": "Ethiopian Birr", "code": "ETB", "symbol": "Br" },
          { "name": "Tanzanian Shilling", "code": "TZS", "symbol": "TSh" },
          { "name": "Ugandan Shilling", "code": "UGX", "symbol": "USh" },
          { "name": "Zambian Kwacha", "code": "ZMW", "symbol": "ZK" },
          { "name": "Malawian Kwacha", "code": "MWK", "symbol": "MK" },
          { "name": "Mozambican Metical", "code": "MZN", "symbol": "MT" },
          { "name": "Botswana Pula", "code": "BWP", "symbol": "P" },
          { "name": "Namibian Dollar", "code": "NAD", "symbol": "$" },
          { "name": "Mauritian Rupee", "code": "MUR", "symbol": "₨" },
          { "name": "Seychellois Rupee", "code": "SCR", "symbol": "₨" },
          { "name": "Rwandan Franc", "code": "RWF", "symbol": "FRw" },
          { "name": "Burundian Franc", "code": "BIF", "symbol": "FBu" },
          { "name": "Congolese Franc", "code": "CDF", "symbol": "FC" },
          { "name": "Central African CFA Franc", "code": "XAF", "symbol": "FCFA" },
          { "name": "West African CFA Franc", "code": "XOF", "symbol": "CFA" },
          { "name": "Cape Verdean Escudo", "code": "CVE", "symbol": "$" },
          { "name": "Mauritanian Ouguiya", "code": "MRU", "symbol": "UM" },
          { "name": "Djiboutian Franc", "code": "DJF", "symbol": "Fdj" },
        ]


/*
            const aCurrenciesLists = [
                {
                     code:"AED",
                     name:"United Arab Emirates dirham",
                },
                {
                    code:"AFN",
                     name:"Afghan afghani",
                },
                {
                    code:"ALL",
                     name:"Albanian lek",
                },
                {
                    code:"AMD",
                     name:"Armenian dram",
                },
                {
                    code:"ANG",
                     name:"Netherlands Antillean guilder",
                },
                {
                    code:"AOA",
                    name:"Angolan kwanza",
                },
                {
                    code:"ARS",
                    name:"Argentine peso",
                },
                {
                    code:"AUD",
                    name:"Australian dollar",
                },
                {
                    code:"AWG",
                    name:"Aruban florin",
                },
                {
                    code:"AZN",
                    name:"Azerbaijani manat",
                },
                {
                    code:"BAM",
                    name:"Bosnia and Herzegovina convertible mark",
                },
                {
                    code:"BBD",
                    name:"Barbados dollar",
                },
                {
                    code:"BDT",
                    name:"Bangladeshi taka",
                },
                {
                    code:"BGN",
                    name:"Bulgarian lev",
                },
                {
                    code:"BHD",
                    name:"Bahraini dinar",
                },
                {
                    code:"BIF",
                    name:"Burundian franc",
                },
                {
                    code:"BMD",
                    name:"Bermudian dollar (customarily known as Bermuda dollar)",
                },
                {
                    code:"BND",
                    name:"Brunei dollar",
                },
                {
                    code:"BOB",
                    name:"Boliviano",
                },
                {
                    code:"BOV",
                    name:"Bolivian Mvdol (funds code)",
                },
                {
                    code:"BRL",
                    name:"Brazilian real",
                },
                {
                    code:"BSD",
                    name:"Bahamian dollar",
                },
                {
                    code:"BTN",
                    name:"Bhutanese ngultrum",
                },
                {
                    code:"BWP",
                    name:"Botswana pula",
                },
                {
                    code:"BYR",
                    name:"Belarusian ruble",
                },
                {
                    code:"BZD",
                    name:"Belize dollar",
                },
                {
                    code:"CAD",
                    name:"Canadian dollar",
                },
                {
                    code:"CDF",
                    name:"Congolese franc",
                },
                {
                    code:"CHE",
                    name:"WIR Euro (complementary currency)",
                },
                {
                    code:"CHF",
                    name:"Swiss franc",
                },
                {
                    code:"CHW",
                    name:"WIR Franc (complementary currency)",
                },
                {
                    code:"CLF",
                    name:"Unidad de Fomento (funds code)",
                },
                {
                    code:"CLP",
                    name:"Chilean peso",
                },
                {
                    code:"CNY",
                    name:"Chinese yuan",
                },
                {
                    code:"COP",
                    name:"Colombian peso",
                },
                {
                    code:"COU",
                    name:"Unidad de Valor Real",
                },
                {
                    code:"CRC",
                    name:"Costa Rican colon",
                },
                {
                    code:"CUC",
                    name:"Cuban convertible peso",
                },
                {
                    code:"CUP",
                    name:"Cuban peso",
                },
                {
                    code:"CVE",
                    name:"Cape Verde escudo",
                },
                {
                    code:"CZK",
                    name:"Czech koruna",
                },
                {
                    code:"DJF",
                    name:"Djiboutian franc",
                },
                {
                    code:"DKK",
                    name:"Danish krone",
                },
                {
                    code:"DOP",
                    name:"Dominican peso",
                },
                {
                    code:"DZD",
                    name:"Algerian dinar",
                },
                {
                    code:"EGP",
                    name:"Egyptian pound",
                },
                {
                    code:"ERN",
                    name:"Eritrean nakfa",
                },
                {
                    code:"ETB",
                    name:"Ethiopian birr",
                },
                {
                    code:"EUR",
                    name:"Euro",
                },
                {
                    code:"FJD",
                    name:"Fiji dollar",
                },
                {
                    code:"FKP",
                    name:"Falkland Islands pound",
                },
                {
                    code:"GBP",
                    name:"Pound sterling",
                },
                {
                    code:"GEL",
                    name:"Georgian lari",
                },
                {
                    code:"GHS",
                    name:"Ghanaian cedi",
                },
                {
                    code:"GIP",
                    name:"Gibraltar pound",
                },
                {
                    code:"GMD",
                    name:"Gambian dalasi",
                },
                {
                    code:"GNF",
                    name:"Guinean franc",
                },
                {
                    code:"GTQ",
                    name:"Guatemalan quetzal",
                },
                {
                    code:"GYD",
                    name:"Guyanese dollar",
                },
                {
                    code:"HKD",
                    name:"Hong Kong dollar",
                },
                {
                    code:"HNL",
                    name:"Honduran lempira",
                },
                {
                    code:"HRK",
                    name:"Croatian kuna",
                },
                {
                    code:"HTG",
                    name:"Haitian gourde",
                },
                {
                    code:"HUF",
                    name:"Hungarian forint",
                },
                {
                    code:"IDR",
                    name:"Indonesian rupiah",
                },
                {
                    code:"ILS",
                    name:"Israeli new shekel",
                },
                {
                    code:"INR",
                    name:"Indian rupee",
                },
                {
                    code:"IQD",
                    name:"Iraqi dinar",
                },
                {
                    code:"IRR",
                    name:"Iranian rial",
                },
                {
                    code:"ISK",
                    name:"Icelandic kr?na",
                },
                {
                    code:"JMD",
                    name:"Jamaican dollar",
                },
                {
                    code:"JOD",
                    name:"Jordanian dinar",
                },
                {
                    code:"JPY",
                    name:"Japanese yen",
                },
                {
                    code:"KES",
                    name:"Kenyan shilling",
                },
                {
                    code:"KGS",
                    name:"Kyrgyzstani som",
                },
                {
                    code:"KHR",
                    name:"Cambodian riel",
                },
                {
                    code:"KMF",
                    name:"Comoro franc",
                },
                {
                    code:"KPW",
                    name:"North Korean won",
                },
                {
                    code:"KRW",
                    name:"South Korean won",
                },
                {
                    code:"KWD",
                    name:"Kuwaiti dinar",
                },
                {
                    code:"KYD",
                    name:"Cayman Islands dollar",
                },
                {
                    code:"KZT",
                    name:"Kazakhstani tenge",
                },
                {
                    code:"LAK",
                    name:"Lao kip",
                },
                {
                    code:"LBP",
                    name:"Lebanese pound",
                },
                {
                    code:"LKR",
                    name:"Sri Lankan rupee",
                },
                {
                    code:"LRD",
                    name:"Liberian dollar",
                },
                {
                    code:"LSL",
                    name:"Lesotho loti",
                },
                {
                    code:"LTL",
                    name:"Lithuanian litas",
                },
                {
                    code:"LVL",
                    name:"Latvian lats",
                },
                {
                    code:"LYD",
                    name:"Libyan dinar",
                },
                {
                    code:"MAD",
                    name:"Moroccan dirham",
                },
                {
                    code:"MDL",
                    name:"Moldovan leu",
                },
                {
                    code:"MGA",
                    name:"Malagasy ariary",
                },
                {
                    code:"MKD",
                    name:"Macedonian denar",
                },
                {
                    code:"MMK",
                    name:"Myanma kyat",
                },
                {
                    code:"MNT",
                    name:"Mongolian tugrik",
                },
                {
                    code:"MOP",
                    name:"Macanese pataca",
                },
                {
                    code:"MRO",
                    name:"Mauritanian ouguiya",
                },
                {
                    code:"MUR",
                    name:"Mauritian rupee",
                },
                {
                    code:"MVR",
                    name:"Maldivian rufiyaa",
                },
                {
                    code:"MWK",
                    name:"Malawian kwacha",
                },
                {
                    code:"MXN",
                    name:"Mexican peso",
                },
                {
                    code:"MXV",
                    name:"Mexican Unidad de Inversion (UDI) (funds code)",
                },
                {
                    code:"MYR",
                    name:"Malaysian ringgit",
                },
                {
                    code:"MZN",
                    name:"Mozambican metical",
                },
                {
                    code:"NAD",
                    name:"Namibian dollar",
                },
                {
                    code:"NGN",
                    name:"Nigerian naira",
                },
                {
                    code:"NIO",
                    name:"Nicaraguan c?rdoba",
                },
                {
                    code:"NOK",
                    name:"Norwegian krone",
                },
                {
                    code:"NPR",
                    name:"Nepalese rupee",
                },
                {
                    code:"NZD",
                    name:"New Zealand dollar",
                },
                {
                    code:"OMR",
                    name:"Omani rial",
                },
                {
                    code:"PAB",
                    name:"Panamanian balboa",
                },
                {
                    code:"PEN",
                    name:"Peruvian nuevo sol",
                },
                {
                    code:"PGK",
                    name:"Papua New Guinean kina",
                },
                {
                    code:"PHP",
                    name:"Philippine peso",
                },
                {
                    code:"PKR",
                    name:"Pakistani rupee",
                },
                {
                    code:"PLN",
                    name:"Polish z?oty",
                },
                {
                    code:"PYG",
                    name:"Paraguayan guaran?",
                },
                {
                    code:"QAR",
                    name:"Qatari riyal",
                },
                {
                    code:"RON",
                    name:"Romanian new leu",
                },
                {
                    code:"RSD",
                    name:"Serbian dinar",
                },
                {
                    code:"RUB",
                    name:"Russian rouble",
                },
                {
                    code:"RWF",
                    name:"Rwandan franc",
                },
                {
                    code:"SAR",
                    name:"Saudi riyal",
                },
                {
                    code:"SBD",
                    name:"Solomon Islands dollar",
                },
                {
                    code:"SCR",
                    name:"Seychelles rupee",
                },
                {
                    code:"SDG",
                    name:"Sudanese pound",
                },
                {
                    code:"SEK",
                    name:"Swedish krona/kronor",
                },
                {
                    code:"SGD",
                    name:"Singapore dollar",
                },
                {
                    code:"SHP",
                    name:"Saint Helena pound",
                },
                {
                    code:"SLL",
                    name:"Sierra Leonean leone",
                },
                {
                    code:"SOS",
                    name:"Somali shilling",
                },
                {
                    code:"SRD",
                    name:"Surinamese dollar",
                },
                {
                    code:"SSP",
                    name:"South Sudanese pound",
                },
                {
                    code:"STD",
                    name:"S?o Tom? and Pr?ncipe dobra",
                },
                {
                    code:"SYP",
                    name:"Syrian pound",
                },
                {
                    code:"SZL",
                    name:"Swazi lilangeni",
                },
                {
                    code:"THB",
                    name:"Thai baht",
                },
                {
                    code:"TJS",
                    name:"Tajikistani somoni",
                },
                {
                    code:"TMT",
                    name:"Turkmenistani manat",
                },
                {
                    code:"TND",
                    name:"Tunisian dinar",
                },
                {
                    code:"TOP",
                    name:"Tongan pa?anga",
                },
                {
                    code:"TRY",
                    name:"Turkish lira",
                },
                {
                    code:"TTD",
                    name:"Trinidad and Tobago dollar",
                },
                {
                    code:"TWD",
                    name:"New Taiwan dollar",
                },
                {
                    code:"TZS",
                    name:"Tanzanian shilling",
                },
                {
                    code:"UAH",
                    name:"Ukrainian hryvnia",
                },
                {
                    code:"UGX",
                    name:"Ugandan shilling",
                },
                {
                    code:"USD",
                    name:"United States dollar",
                },
                {
                    code:"UYU",
                    name:"Uruguayan peso",
                },
                {
                    code:"UZS",
                    name:"Uzbekistan som",
                },
                {
                    code:"VEF",
                    name:"Venezuelan bol?var fuerte",
                },
                {
                    code:"VND",
                    name:"Vietnamese dong",
                },
                {
                    code:"VUV",
                    name:"Vanuatu vatu",
                },
                {
                    code:"WST",
                    name:"Samoan tala",
                },
                {
                    code:"XAF",
                    name:"CFA franc BEAC",
                },
                {
                    code:"XAG",
                    name:"Silver (one troy ounce)",
                },
                {
                    code:"XAU",
                    name:"Gold (one troy ounce)",
                },
                {
                    code:"XBA",
                    name:"European Composite Unit (EURCO) (bond market unit)",
                },
                {
                    code:"XBB",
                    name:"European Monetary Unit (E.M.U.-6) (bond market unit)",
                },
                {
                    code:"XBC",
                    name:"European Unit of Account 9 (E.U.A.-9) (bond market unit)",
                },
                {
                    code:"XBD",
                    name:"European Unit of Account 17 (E.U.A.-17) (bond market unit)",
                },
                {
                    code:"XCD",
                    name:"East Caribbean dollar",
                },
                {
                    code:"XDR",
                    name:"Special drawing rights",
                },
                {
                    code:"XFU",
                    name:"UIC franc (special settlement currency)",
                },
                {
                    code:"XOF",
                    name:"CFA franc BCEAO",
                },
                {
                    code:"XPD",
                    name:"Palladium (one troy ounce)",
                },
                {
                    code:"XPF",
                    name:"CFP franc",
                },
                {
                    code:"XPT",
                    name:"Platinum (one troy ounce)",
                },
                {
                    code:"XTS",
                    name:"Code reserved for testing purposes",
                },
                {
                    code:"XXX",
                    name:"No currency",
                },
                {
                    code:"YER",
                    name:"Yemeni rial",
                },
                {
                    code:"ZAR",
                    name:"South African rand",
                },
                {
                    code:"ZMW",
                    name:"Zambian kwacha",
                }
            ]            
*/          