/*
===================================================
BWP401: دليل فعاليات رأس البسيط - ملف JavaScript الرئيسي (main.js)
المتطلبات: سلايدر، فلترة، تحقق نموذج اتصال، ترجمة ثنائية اللغة
===================================================
*/

// انتظار تحميل DOM بالكامل قبل تشغيل السكربتات
$(document).ready(function() {
    
    // ----------------------------------
    // 1. تأثير السلايدر للفعاليات البارزة (index.html)
    // ----------------------------------
    if ($('#featuredEventsSlider').length) {
        $('#featuredEventsSlider').carousel({
            interval: 5000 // 5 ثواني
        });
        console.log("تم تهيئة سلايدر الفعاليات البارزة.");
    }


    // ----------------------------------
    // 2. التحقق من نموذج الاتصال (contact.html)
    // ----------------------------------
    const contactForm = document.getElementById('contactForm');
    const formMessages = document.getElementById('formMessages');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            contactForm.classList.remove('was-validated');
            formMessages.innerHTML = ''; 

            if (contactForm.checkValidity() === false) {
                contactForm.classList.add('was-validated');
                const currentLang = document.documentElement.getAttribute('lang');
                const errorMessage = currentLang === 'ar' 
                    ? 'فشل الإرسال: الرجاء ملء جميع الحقول المطلوبة بشكل صحيح.'
                    : 'Submission failed: Please fill all required fields correctly.';
                displayAlert(errorMessage, 'danger');
            } else {
                const currentLang = document.documentElement.getAttribute('lang');
                const successMessage = currentLang === 'ar'
                    ? 'تم استلام رسالتك بنجاح! سنقوم بالرد قريباً.'
                    : 'Your message has been received successfully! We will reply soon.';
                displayAlert(successMessage, 'success');
                
                contactForm.reset();
                contactForm.classList.remove('was-validated');
            }
        }, false);
    }
    
    function displayAlert(message, type) {
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert" dir="${document.documentElement.getAttribute('dir')}">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        formMessages.innerHTML = alertHtml;
    }


    // ----------------------------------
    // 3. فلترة قائمة الفعاليات (events.html)
    // ----------------------------------
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');
    const allEventsContainer = document.getElementById('allEvents');

    if (searchInput || categoryFilter || dateFilter) {
        [searchInput, categoryFilter, dateFilter].forEach(element => {
            if (element) {
                element.addEventListener('input', filterEvents);
                element.addEventListener('change', filterEvents);
            }
        });
    }

    function filterEvents() {
        if (!allEventsContainer) return;

        const searchText = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        const selectedDate = dateFilter ? dateFilter.value : '';

        const eventCards = allEventsContainer.querySelectorAll('.col');

        eventCards.forEach(col => {
            const card = col.querySelector('.event-card-custom');
            if (!card) return;

            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const categoryElement = card.querySelector('.badge');
            const categoryText = categoryElement ? categoryElement.textContent.trim() : '';
            const dateText = card.querySelector('.fa-calendar-alt')?.parentElement?.textContent || '';
            
            const matchesSearch = (title.includes(searchText));
            const matchesCategory = selectedCategory === 'all' || categoryText.includes(selectedCategory);
            let matchesDate = true;
            if (selectedDate && dateText) {
                matchesDate = dateText.includes(selectedDate); 
            }
            
            if (matchesSearch && matchesCategory && matchesDate) {
                col.style.display = 'block';
            } else {
                col.style.display = 'none';
            }
        });
    }

    filterEvents();
    
    
    // ----------------------------------
    // 4. خاصية إضافية: زر الانتقال للأعلى
    // ----------------------------------
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.id = 'scrollToTopBtn';
    scrollToTopBtn.classList.add('btn', 'btn-gold-custom', 'shadow');
    
    scrollToTopBtn.style.cssText = `
        position: fixed; 
        bottom: 20px; 
        right: 20px; 
        z-index: 1000; 
        display: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
    `;
    
    document.body.appendChild(scrollToTopBtn);

    window.onscroll = function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    };

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});

// ----------------------------------
// 5. نظام الترجمة الثنائية اللغة والثيم
// ----------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
    const languageDropdown = document.getElementById('languageDropdown');
    const currentLangSpan = document.getElementById('currentLang');
    const langDropdownItems = document.querySelectorAll('[data-lang]');
    const htmlElement = document.documentElement;

    // الترجمات
    const translations = {
        ar: {
            // Navigation
            home: "الرئيسية",
            browseAll: "استعراض الكل",
            about: "عن الدليل",
            contact: "تواصل معنا",
            
            // Hero Section
            heroTitle: "رأس البسيط: سحر الساحل والأنشطة البحرية",
            heroSubtitle: "دليلك الشامل لأهم الأنشطة البحرية، والمهرجانات الصيفية، والفعاليات في رأس البسيط.",
            browseEvents: "تصفح الفعاليات الآن",
            
            // Sections
            fishingFestival: "مهرجان الصيد السنوي برأس البسيط",
            fishingTitle: "مسابقة الصيد الساحلية وعروض القوارب",
            fishingDesc: "فعالية سنوية تعكس تراث الصيد البحري، تشمل مسابقات صيد، عروضاً للقوارب التقليدية، وأمسيات شعبية على شاطئ البحر.",
            details: "التفاصيل",
            
            discoverByCategory: "اكتشف حسب التصنيف",
            marineActivities: "أنشطة بحرية",
            seafood: "مأكولات بحرية",
            camping: "تخييم",
            summerFestivals: "مهرجانات صيفية",
            
            upcomingEvents: "فعاليات رأس البسيط قادمة",
            beachVolleyball: "بطولة الكرة الطائرة الشاطئية",
            beachVolleyballDesc: "منافسات محلية ودولية على رمال شاطئ رأس البسيط.",
            sunsetPhotography: "أمسيات تصوير الغروب",
            sunsetPhotographyDesc: "ورش عمل لتصوير المناظر الطبيعية الساحلية عند غروب الشمس.",
            coastalNights: "ليالي الساحل الموسيقية",
            coastalNightsDesc: "حفلات غنائية على الهواء الطلق بمشاركة فنانين محليين وعرب.",
            
            // Categories
            summerSports: "رياضة صيفية",
            visualArts: "فنون بصرية",
            arabicMusic: "موسيقى عربية",
            
            // Dates
            nov20_25: "20-25 نوفمبر",
            everyFridayNov: "كل جمعة من شهر نوفمبر",
            nov15: "15 نوفمبر",
            
            // Footer
            footerTitle: "فعاليات رأس البسيط",
            footerDesc: "بوابة لاستكشاف أجمل الفعاليات على الساحل السوري.",
            quickLinks: "روابط سريعة",
            contactUs: "تواصل معنا",
            email: "البريد الإلكتروني:",
            rights: "© 2026 دليل فعاليات رأس البسيط. جميع الحقوق محفوظة.",
            project: "مشروع مقرر BWP401",
            team: "فريق العمل:",
               "contactPageTitle": "تواصل معنا - فعاليات رأس البسيط",
        "contactMainTitle": "تواصل معنا واقترح فعاليتك",
        "sendMessage": "أرسل رسالتك",
        "fullName": "الاسم الكامل",
        "email": "البريد الإلكتروني",
        "subject": "الموضوع",
        "generalInquiry": "استفسار عام",
        "eventSubmission": "تقديم فعالية في رأس البسيط",
        "collaboration": "اقتراح تعاون أو شراكة",
        "other": "أخرى",
        "message": "الرسالة",
        "sendButton": "إرسال الرسالة",
        "otherContact": "طرق تواصل أخرى",
        "generalEmail": "البريد العام",
        "phone": "الهاتف",
        "address": "العنوان",
        "followUs": "تابعنا",
        "location": "موقع رأس البسيط",
        
        // About Page
        "aboutPageTitle": "عن الدليل - فعاليات رأس البسيط",
        "aboutMainTitle": "تعرف على دليل فعاليات رأس البسيط",
        "vision": "رؤيتنا ورسالتنا",
        "visionText": "نسعى لترسيخ مكانة رأس البسيط كوجهة سياحية بحرية وبيئية رائدة. دليلنا هو المنصة الرئيسية لجميع الأنشطة المائية، الرياضات الشاطئية، والفعاليات الثقافية في المنطقة.",
        "goal": "هدفنا",
        "goalText": "تسهيل وصول المصطافين والمهتمين إلى جدول فعاليات متكامل يغطي جميع جوانب الترفيه، السياحة البيئية، والأنشطة البحرية، مما يعزز جمال هذه البقعة الساحلية.",
        "team": "فريق العمل",
        "teamLead": "قائدة الفريق والمشروع",
        "frontend": "مطورة الواجهة الأمامية (Front-end)",
        "designer": "مصممة UX/UI",
        "quality": "مشرفة الجودة",
        "content": "تدقيق المحتوى",
        "policies": "سياسات الدليل",
        "policy1Title": "سياسة تقديم فعالية جديدة",
        "policy1Text": "يجب تقديم طلب إضافة الفعالية قبل شهر واحد على الأقل من تاريخ إقامتها. يتم مراجعة الطلب والموافقة عليه خلال 7 أيام عمل.",
        "policy2Title": "معايير النشر المختصرة",
        "policy2Text": "يجب أن تكون الفعالية ذات صلة مباشرة بطابع رأس البسيط (الأنشطة البحرية، التخييم، الرياضات الشاطئية، أو التراث الساحلي)."
    ,
            "eventPageTitle": "تفاصيل الفعالية - فعاليات رأس البسيط",
        "breadcrumbHome": "الرئيسية",
        "breadcrumbEvents": "استعراض الكل",
        "breadcrumbEvent": "مهرجان الصيد السنوي",
        "eventDescription": "احتفالية سنوية تجمع محبي البحر والصيد في أجواء تنافسية وترفيهية ممتعة.",
        "basicDetails": "تفاصيل أساسية",
        "timing": "التوقيت",
        "timingDetails": "من 9:00 صباحاً حتى 6:00 مساءً يومياً",
        "location": "الموقع",
        "locationDetails": "شاطئ رأس البسيط الغربي، قرب منارة الميناء",
        "cost": "التكلفة",
        "costDetails": "المشاركة في المسابقة 50,000 ل.س / الدخول مجاني للزوار",
        "aboutEvent": "عن المهرجان",
        "eventDetails": "يهدف المهرجان إلى إحياء التراث البحري للمنطقة وتعزيز الوعي بأهمية البيئة البحرية. يتضمن المهرجان معرضاً للحرف اليدوية المتعلقة بالبحر، وعروضاً فلكلورية، ومأكولات بحرية طازجة.",
        "mainProgram": "البرنامج الرئيسي:",
        "programDay1": "اليوم الأول: افتتاح رسمي ومسابقة صيد الأسماك الكبرى (جوائز كبرى لأثقل سمكة).",
        "programDay2": "اليوم الثاني: ورشة عمل عن صيانة القوارب التقليدية وعرض قوارب تراثية.",
        "programDay3": "اليوم الثالث: أمسية شعبية وحفل توزيع الجوائز على شاطئ البحر.",
        "comments": "التعليقات",
        "commenter": "محمد علي",
        "commentTime": "منذ يومين",
        "commentText": "المهرجان كان رائعاً، استمتعت بمسابقة الصيد كثيراً! أتمنى التركيز أكثر على تنظيف الشاطئ العام القادم.",
        "reserveSeat": "حجز المقعد",
        "reserveDescription": "احجز مكانك في المسابقة أو تذكرتك لدخول الحفلات الخاصة.",
        "bookNow": "احجز الآن",
        "eventOrganizer": "منظم الفعالية",
        "organizerName": "جمعية أصدقاء البحر",
        "organizerDescription": "تهدف الجمعية للحفاظ على البيئة البحرية والساحلية في منطقة رأس البسيط.",
        "contactOrganizer": "تواصل مع المنظم",
        
        // Events Listing Page
        "eventsPageTitle": "استعراض الكل - فعاليات رأس البسيط",
        "allEventsTitle": "كل فعاليات رأس البسيط",
        "searchPlaceholder": "ابحث عن فعاليات، مهرجانات، أو مواقع...",
        "searchButton": "بحث",
        "sortBy": "ترتيب حسب التاريخ",
        "sortOption1": "الأقرب قريباً",
        "sortOption2": "الأقدم أولاً",
        "sortOption3": "الأكثر شعبية",
        "marineBadge": "بحري",
        "summerBadge": "صيفي",
        "environmentalBadge": "بيئي",
        "fishingCompetition": "مسابقة الصيد الكبرى",
        "fishingDescription": "منافسة ودية لمحبي الصيد، مع جوائز قيمة وعشاء بحري تقليدي.",
        "musicFestival": "مهرجان رأس البسيط الصيفي للموسيقى",
        "musicDescription": "حفلات غنائية مباشرة على الشاطئ، تشمل فنانين محليين وعروض ضوئية.",
        "campingAdventure": "مغامرة التخييم في التلال الساحلية",
        "campingDescription": "رحلة تخييم منظمة لاستكشاف جمال الطبيعة المحيطة برأس البسيط.",
        "date": "التاريخ",
        "detailsAndBooking": "التفاصيل وحجز المقاعد",
        "haveEvent": "هل لديك فعالية؟",
        "eventPrompt": "قدم فعاليتك الآن لتصل إلى آلاف المهتمين في المنطقة الساحلية.",
        "submitEvent": "قدم فعاليتك الآن",
        "paginationPrevious": "السابق",
        "paginationNext": "التالي"    
    },
        en: {
            // Navigation
            home: "Home",
            browseAll: "Browse All",
            about: "About Guide",
            contact: "Contact Us",
            
            // Hero Section
            heroTitle: "Ras El Basit: Coastal Charm and Marine Activities",
            heroSubtitle: "Your comprehensive guide to the most important marine activities, summer festivals, and events in Ras El Basit.",
            browseEvents: "Browse Events Now",
            
            // Sections
            fishingFestival: "Annual Fishing Festival at Ras El Basit",
            fishingTitle: "Coastal Fishing Competition and Boat Shows",
            fishingDesc: "An annual event reflecting the heritage of marine fishing, includes fishing competitions, traditional boat displays, and popular evenings on the beach.",
            details: "Details",
            
            discoverByCategory: "Discover by Category",
            marineActivities: "Marine Activities",
            seafood: "Seafood",
            camping: "Camping",
            summerFestivals: "Summer Festivals",
            
            upcomingEvents: "Upcoming Ras El Basit Events",
            beachVolleyball: "Beach Volleyball Championship",
            beachVolleyballDesc: "Local and international competitions on the sands of Ras El Basit beach.",
            sunsetPhotography: "Sunset Photography Evenings",
            sunsetPhotographyDesc: "Workshops for photographing coastal landscapes at sunset.",
            coastalNights: "Coastal Music Nights",
            coastalNightsDesc: "Open-air singing concerts with the participation of local and Arab artists.",
            
            // Categories
            summerSports: "Summer Sports",
            visualArts: "Visual Arts",
            arabicMusic: "Arabic Music",
            
            // Dates
            nov20_25: "November 20-25",
            everyFridayNov: "Every Friday in November",
            nov15: "November 15",
            
            // Footer
            footerTitle: "Ras El Basit Events",
            footerDesc: "A gateway to explore the most beautiful events on the Syrian coast.",
            quickLinks: "Quick Links",
            contactUs: "Contact Us",
            email: "Email:",
            rights: "© 2026 Ras El Basit Events Guide. All rights reserved.",
            project: "BWP401 Course Project",
            team: "Team:",
             "contactPageTitle": "Contact Us - Ras El Basit Events",
        "contactMainTitle": "Contact Us and Suggest Your Event",
        "sendMessage": "Send Your Message",
        "fullName": "Full Name",
        "email": "Email Address",
        "subject": "Subject",
        "generalInquiry": "General Inquiry",
        "eventSubmission": "Submit an Event in Ras El Basit",
        "collaboration": "Collaboration or Partnership Proposal",
        "other": "Other",
        "message": "Message",
        "sendButton": "Send Message",
        "otherContact": "Other Ways to Contact",
        "generalEmail": "General Email",
        "phone": "Phone",
        "address": "Address",
        "followUs": "Follow Us",
        "location": "Ras El Basit Location",
        
        // About Page
        "aboutPageTitle": "About Guide - Ras El Basit Events",
        "aboutMainTitle": "Get to Know Ras El Basit Events Guide",
        "vision": "Our Vision and Mission",
        "visionText": "We strive to establish Ras El Basit as a leading marine and environmental tourist destination. Our guide is the main platform for all water activities, beach sports, and cultural events in the area.",
        "goal": "Our Goal",
        "goalText": "To facilitate access for visitors and enthusiasts to a comprehensive events schedule covering all aspects of entertainment, eco-tourism, and marine activities, enhancing the beauty of this coastal spot.",
        "team": "Our Team",
        "teamLead": "Team and Project Leader",
        "frontend": "Front-end Developer",
        "designer": "UX/UI Designer",
        "quality": "Quality Supervisor",
        "content": "Content Reviewer",
        "policies": "Guide Policies",
        "policy1Title": "New Event Submission Policy",
        "policy1Text": "Event addition requests must be submitted at least one month prior to the event date. The request is reviewed and approved within 7 business days.",
        "policy2Title": "Brief Publishing Criteria",
        "policy2Text": "The event must be directly related to the character of Ras El Basit (marine activities, camping, beach sports, or coastal heritage)."
    ,
     "eventPageTitle": "Event Details - Ras El Basit Events",
        "breadcrumbHome": "Home",
        "breadcrumbEvents": "Browse All",
        "breadcrumbEvent": "Annual Fishing Festival",
        "eventDescription": "An annual celebration that brings together sea and fishing enthusiasts in a competitive and entertaining atmosphere.",
        "basicDetails": "Basic Details",
        "timing": "Timing",
        "timingDetails": "From 9:00 AM to 6:00 PM daily",
        "location": "Location",
        "locationDetails": "West Ras El Basit Beach, near the port lighthouse",
        "cost": "Cost",
        "costDetails": "Competition participation 50,000 SYP / Free entry for visitors",
        "aboutEvent": "About the Festival",
        "eventDetails": "The festival aims to revive the marine heritage of the region and raise awareness about the importance of the marine environment. The festival includes an exhibition of marine-related handicrafts, folkloric shows, and fresh seafood.",
        "mainProgram": "Main Program:",
        "programDay1": "Day 1: Official opening and major fishing competition (major prizes for the heaviest fish).",
        "programDay2": "Day 2: Workshop on traditional boat maintenance and heritage boat display.",
        "programDay3": "Day 3: Popular evening and awards ceremony on the beach.",
        "comments": "Comments",
        "commenter": "Mohammed Ali",
        "commentTime": "2 days ago",
        "commentText": "The festival was amazing, I really enjoyed the fishing competition! I hope there will be more focus on beach cleaning next year.",
        "reserveSeat": "Reserve Your Seat",
        "reserveDescription": "Book your spot in the competition or your ticket for private parties.",
        "bookNow": "Book Now",
        "eventOrganizer": "Event Organizer",
        "organizerName": "Friends of the Sea Association",
        "organizerDescription": "The association aims to preserve the marine and coastal environment in the Ras El Basit area.",
        "contactOrganizer": "Contact Organizer",
        
        // Events Listing Page
        "eventsPageTitle": "Browse All - Ras El Basit Events",
        "allEventsTitle": "All Ras El Basit Events",
        "searchPlaceholder": "Search for events, festivals, or locations...",
        "searchButton": "Search",
        "sortBy": "Sort by Date",
        "sortOption1": "Soonest First",
        "sortOption2": "Oldest First",
        "sortOption3": "Most Popular",
        "marineBadge": "Marine",
        "summerBadge": "Summer",
        "environmentalBadge": "Environmental",
        "fishingCompetition": "Grand Fishing Competition",
        "fishingDescription": "Friendly competition for fishing enthusiasts, with valuable prizes and traditional seafood dinner.",
        "musicFestival": "Ras El Basit Summer Music Festival",
        "musicDescription": "Live singing concerts on the beach, including local artists and light shows.",
        "campingAdventure": "Camping Adventure in Coastal Hills",
        "campingDescription": "Organized camping trip to explore the natural beauty surrounding Ras El Basit.",
        "date": "Date",
        "detailsAndBooking": "Details & Booking",
        "haveEvent": "Have an Event?",
        "eventPrompt": "Submit your event now to reach thousands of interested people in the coastal area.",
        "submitEvent": "Submit Your Event",
        "paginationPrevious": "Previous",
        "paginationNext": "Next"    
    }
    };

    // تحديد الحالة الأولية من Local Storage
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLang = localStorage.getItem('lang') || 'ar';
    
    // تطبيق السمة واللغة المحفوظتين
    htmlElement.setAttribute('data-bs-theme', savedTheme);
    htmlElement.setAttribute('lang', savedLang);
    htmlElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');

    // تحديث حالة زر التبديل للثيم
    if (savedTheme === 'dark') {
        themeToggle.checked = true;
        themeLabel.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.checked = false;
        themeLabel.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // تحديث اللغة الحالية
    currentLangSpan.textContent = savedLang === 'ar' ? 'AR' : 'EN';

    // تطبيق الترجمات عند التحميل
    updateContent(savedLang);

    // معالج حدث تبديل الثيم
    if (themeToggle) {
        themeToggle.addEventListener('change', function(e) {
            e.stopPropagation();
            
            let newTheme;
            
            if (this.checked) {
                newTheme = 'dark';
                themeLabel.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                newTheme = 'light';
                themeLabel.innerHTML = '<i class="fas fa-moon"></i>';
            }
            
            // تطبيق وتبديل الوضع الداكن فقط
            htmlElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // معالج حدث تغيير اللغة
    langDropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const newLang = this.getAttribute('data-lang');
            
            // تطبيق اللغة الجديدة
            htmlElement.setAttribute('lang', newLang);
            htmlElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
            localStorage.setItem('lang', newLang);
            
            // تحديث الزر
            currentLangSpan.textContent = newLang === 'ar' ? 'AR' : 'EN';
            
            // تحديث المحتوى باللغة الجديدة
            updateContent(newLang);
            
            // إغلاق الدروبداون
            const dropdown = document.getElementById('languageDropdown');
            const bsDropdown = bootstrap.Dropdown.getInstance(dropdown);
            if (bsDropdown) {
                bsDropdown.hide();
            }
        });
    });

    // دالة تحديث المحتوى بناءً على اللغة
    function updateContent(lang) {
        const translation = translations[lang];
        
        // تحديث عناصر الصفحة
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translation[key]) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translation[key];
                } else if (element.tagName === 'INPUT' && element.type !== 'text') {
                    // لا نترجم قيم input غير النصية
                } else {
                    element.textContent = translation[key];
                }
            }
        });
        
        // تحديث عنوان الصفحة
        const pageTitle = document.querySelector('title[data-translate]');
        if (pageTitle) {
            const titleKey = pageTitle.getAttribute('data-translate');
            if (translation[titleKey]) {
                document.title = translation[titleKey];
            }
        }
    }
});