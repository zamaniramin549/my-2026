'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function Home() {
  const [activeSection, setActiveSection] = useState('');
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseTrail, setMouseTrail] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;

        if (isInView) {
          setActiveSection(section.id);
          setIsVisible(prev => ({ ...prev, [section.id]: true }));
        }
      });
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      setMouseTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }];
        return newTrail.slice(-20);
      });
    };

    // SUPER lenient intersection observer - keep sections visible once shown
    const observerOptions = {
      threshold: [0, 0.01],
      rootMargin: '500px 0px 500px 0px' // Extremely generous margins
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const section = entry.target;

        // Show section if ANY part is intersecting
        if (entry.isIntersecting) {
          section.classList.add('section-visible');
          section.classList.remove('section-hidden');

          // Trigger stagger animations for child elements
          const children = section.querySelectorAll('.stagger-item');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('stagger-visible');
              child.classList.remove('stagger-hidden');
            }, index * 100);
          });
        }
        // NEVER hide sections once shown - this prevents disappearing content
      });
    }, observerOptions);

    // Observe all sections and show them initially
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      observer.observe(section);

      // Show ALL sections initially to prevent dark screens
      section.classList.add('section-visible');
    });

    // Fallback: Force visibility check after a short delay
    setTimeout(() => {
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // If section is anywhere near viewport, show it
        if (rect.top < windowHeight + 500 && rect.bottom > -500) {
          section.classList.add('section-visible');
          section.classList.remove('section-hidden');
        }
      });
    }, 100);

    // Handle smooth scroll with offset for navbar
    const handleNavClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.slice(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          // Force the section to be visible immediately
          targetSection.classList.add('section-visible');
          targetSection.classList.remove('section-hidden');

          // Calculate offset for fixed navbar (80px navbar height)
          const navbarHeight = 80;
          const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

          // Smooth scroll to position
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Trigger animations for child elements
          const children = targetSection.querySelectorAll('.stagger-item');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('stagger-visible');
              child.classList.remove('stagger-hidden');
            }, index * 100);
          });

          // Update URL without triggering hashchange
          history.pushState(null, null, href);
        }
      }
    };

    // Add click handlers to all nav links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', handleNavClick);
    });

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      navLinks.forEach(link => {
        link.removeEventListener('click', handleNavClick);
      });
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log('Registration:', registerForm);
    alert('Thank you for registering! We will send you updates about Visit Malaysia 2026.');
    setRegisterForm({ firstName: '', lastName: '', email: '' });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact:', contactForm);
    alert('Message sent successfully! We will get back to you soon.');
    setContactForm({ firstName: '', lastName: '', email: '', message: '' });
  };

  const attractions = [
    {
      title: "Petronas Twin Towers",
      description: "The iconic 88-story twin skyscrapers dominating Kuala Lumpur's skyline, offering breathtaking views and world-class shopping experiences.",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80"
    },
    {
      title: "Langkawi Islands",
      description: "A tropical paradise with pristine beaches, crystal-clear waters, and lush rainforests. Perfect for relaxation and adventure.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
    },
    {
      title: "Batu Caves",
      description: "A limestone hill with ancient caves and cave temples, featuring the iconic 140-foot golden statue of Lord Murugan and 272 colorful steps.",
      image: "https://images.unsplash.com/photo-1508062878650-88b52897f298?w=800&q=80"
    },
    {
      title: "George Town, Penang",
      description: "UNESCO World Heritage site known for its well-preserved colonial architecture, vibrant street art, and legendary street food scene.",
      image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80"
    },
    {
      title: "Cameron Highlands",
      description: "Malaysia's largest hill station offering cool climate, sprawling tea plantations, strawberry farms, and stunning mountain scenery.",
      image: "https://images.unsplash.com/photo-1563789031959-4c02bcb41319?w=800&q=80"
    },
    {
      title: "Malacca City",
      description: "Historic city rich in cultural heritage, featuring Dutch colonial buildings, ancient temples, and a fascinating blend of Malay, Chinese, and European influences.",
      image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800&q=80"
    }
  ];

  const experiences = [
    {
      icon: "🍜",
      title: "Culinary Paradise",
      description: "Savor the incredible fusion of Malay, Chinese, Indian, and Peranakan cuisines. From street food to fine dining, Malaysia is a food lover's dream destination."
    },
    {
      icon: "🏝️",
      title: "Tropical Islands",
      description: "Explore over 800 islands with pristine beaches, world-class diving spots, and luxurious resorts. From Langkawi to Perhentian Islands, paradise awaits."
    },
    {
      icon: "🌳",
      title: "Rainforest Adventures",
      description: "Trek through some of the world's oldest rainforests, home to orangutans, tigers, and exotic wildlife. Experience nature at its most magnificent."
    },
    {
      icon: "🕌",
      title: "Cultural Mosaic",
      description: "Immerse yourself in a harmonious blend of cultures. Visit mosques, temples, churches, and experience festivals that celebrate Malaysia's diversity."
    },
    {
      icon: "🏙️",
      title: "Modern Marvels",
      description: "Marvel at futuristic architecture in Kuala Lumpur, shop in mega malls, and experience the perfect blend of tradition and modernity."
    },
    {
      icon: "🎭",
      title: "Arts & Heritage",
      description: "Discover traditional crafts, vibrant street art, museums, and cultural performances that showcase Malaysia's rich artistic heritage."
    }
  ];

  return (
    <div className={`${geistSans.className} bg-black text-white overflow-x-hidden cursor-none`}>
      {/* Custom Cursor Effect - EXPLOSIVE Dragon Tail */}

      {/* Trail Effect - Dragon Tail */}
      {mouseTrail.map((point, index) => {
        const progress = index / mouseTrail.length;
        const size = 40 - (index * 1.8); // Larger decreasing size
        const opacity = progress * 0.8; // Higher opacity

        return (
          <div
            key={point.id}
            className="cursor-trail"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity,
            }}
          />
        );
      })}

      {/* Main Cursor - Dragon Head */}
      <div
        className="cursor-glow-large"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />
      <div
        className="cursor-glow"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />
      <div
        className="cursor-dot"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-blue-600 bg-clip-text text-transparent">
              Visit Malaysia 2026
            </div>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#hero" className="hover:text-yellow-400 transition-colors">Home</a>
            <a href="#about" className="hover:text-yellow-400 transition-colors">About</a>
            <a href="#attractions" className="hover:text-yellow-400 transition-colors">Attractions</a>
            <a href="#experiences" className="hover:text-yellow-400 transition-colors">Experiences</a>
            <a href="#register" className="hover:text-yellow-400 transition-colors">Register</a>
            <a href="#contact" className="hover:text-yellow-400 transition-colors">Contact</a>
          </div>
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen relative flex items-center justify-center overflow-hidden pt-20 section-animate-hero"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ top: '10%', left: '10%' }}></div>
          <div className="absolute w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-float-delayed" style={{ top: '60%', right: '10%' }}></div>
          <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow" style={{ bottom: '10%', left: '50%' }}></div>
        </div>

        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://www.eyeonasia.gov.sg/images/asean-countries/Malaysia%20snapshot%20cover%20iso.jpg"
            alt="Kuala Lumpur Skyline"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>

        <div className={`max-w-7xl mx-auto px-6 z-10 transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center space-y-8">
            <div className="inline-block mb-4">
              <span className="px-6 py-2 bg-gradient-to-r from-yellow-500/20 to-red-500/20 border border-yellow-500/30 rounded-full text-yellow-400 font-semibold animate-pulse">
                Official Campaign 2026
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-slide-up">
              <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-blue-600 bg-clip-text text-transparent animate-gradient">
                Visit Malaysia 2026
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-200 max-w-4xl mx-auto mb-4 animate-slide-up-delayed font-semibold">
              Truly Asia, Truly Unforgettable
            </p>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 animate-slide-up-delayed">
              Discover the perfect harmony of cultures, cuisines, and natural wonders. Experience a nation where tradition meets modernity, and every journey creates memories that last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up-more-delayed">
              <a
                href="#register"
                className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 via-red-500 to-red-600 rounded-full font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/50"
              >
                <span className="relative z-10">Register for Updates</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <a
                href="#about"
                className="px-8 py-4 border-2 border-white/20 rounded-full font-semibold text-lg hover:border-yellow-400 hover:bg-white/5 transition-all"
              >
                Explore More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Malaysia Section */}
      <section
        id="about"
        className="min-h-screen relative py-20 overflow-hidden section-animate-slide-left"
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #facc15 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className={`max-w-7xl mx-auto px-6 z-10 transition-all duration-1000 ${isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-red-600 bg-clip-text text-transparent">
                About Malaysia
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A Melting Pot of Cultures, Flavors, and Natural Beauty
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-yellow-400">The Heart of Southeast Asia</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Malaysia is a stunning Southeast Asian country that seamlessly blends ancient traditions with modern innovation. Located in the heart of Asia, this tropical paradise offers visitors an incredible diversity of experiences across its 13 states and 3 federal territories.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                From the gleaming skyscrapers of Kuala Lumpur to the ancient rainforests of Borneo, from pristine beaches to mist-covered highlands, Malaysia captivates travelers with its natural beauty and warm hospitality.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Home to over 32 million people representing Malay, Chinese, Indian, and indigenous communities, Malaysia celebrates its multicultural heritage through festivals, cuisine, and daily life, making it truly Asia's most harmonious nation.
              </p>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden group">
              <Image
                src="https://a.travel-assets.com/findyours-php/viewfinder/images/res70/473000/473015-Kuala-Lumpur.jpg"
                alt="Kuala Lumpur cityscape"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mt-16">
            {[
              { number: '13', label: 'States', icon: '🏛️' },
              { number: '878', label: 'Islands', icon: '🏝️' },
              { number: '130M+', label: 'Years Old Rainforest', icon: '🌳' },
              { number: '32M+', label: 'Friendly People', icon: '👥' }
            ].map((stat, i) => (
              <div
                key={i}
                className={`stagger-item text-center p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-yellow-500/50 transition-all hover:transform hover:scale-105`}
              >
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attractions Section */}
      <section
        id="attractions"
        className="min-h-screen relative py-20 overflow-hidden section-animate-flip"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-float" style={{ top: '20%', left: '5%' }}></div>
          <div className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-float-delayed" style={{ bottom: '20%', right: '5%' }}></div>
        </div>

        <div className={`max-w-7xl mx-auto px-6 z-10 transition-all duration-1000 ${isVisible.attractions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-red-600 bg-clip-text text-transparent">
                Must-Visit Attractions
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover iconic landmarks and hidden gems across Malaysia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {attractions.map((attraction, i) => (
              <div
                key={i}
                className={`stagger-item group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-yellow-500/50 transition-all hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20`}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={attraction.image}
                    alt={attraction.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-yellow-400 transition-colors">
                    {attraction.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {attraction.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section
        id="experiences"
        className="min-h-screen relative py-20 overflow-hidden section-animate-slide-right"
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #ef4444 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className={`max-w-7xl mx-auto px-6 z-10 transition-all duration-1000 ${isVisible.experiences ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                Unique Experiences
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Immerse yourself in the Malaysian way of life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((exp, i) => (
              <div
                key={i}
                className={`stagger-item group p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-red-500/50 transition-all hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20`}
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                  {exp.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-400 transition-colors">
                  {exp.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80"
                alt="Malaysian cuisine"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-3xl font-bold text-white mb-2">World-Class Cuisine</h3>
                <p className="text-gray-200">Experience flavors you'll never forget</p>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-red-400">Why Visit Malaysia in 2026?</h3>
              <ul className="space-y-4 text-gray-300 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 text-2xl">✓</span>
                  <span>Special events and festivals throughout the year celebrating Malaysia's rich heritage</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 text-2xl">✓</span>
                  <span>New tourism infrastructure and improved connectivity across the nation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 text-2xl">✓</span>
                  <span>Exclusive promotions and packages from hotels, airlines, and tour operators</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 text-2xl">✓</span>
                  <span>Enhanced visitor experiences at major attractions and cultural sites</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Register Section */}
      <section
        id="register"
        className="min-h-screen relative flex items-center justify-center py-20 overflow-hidden section-animate-scale"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ top: '10%', left: '10%' }}></div>
          <div className="absolute w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-float-delayed" style={{ bottom: '10%', right: '10%' }}></div>
        </div>

        <div className={`max-w-2xl mx-auto px-6 z-10 w-full transition-all duration-1000 ${isVisible.register ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-red-600 bg-clip-text text-transparent">
                Stay Updated
              </span>
            </h2>
            <p className="text-xl text-gray-300">Register to receive exclusive updates, travel tips, and special offers for Visit Malaysia 2026</p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-6 bg-white/5 backdrop-blur-lg p-8 md:p-12 rounded-3xl border border-white/10 hover:border-yellow-500/50 transition-all">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="block text-sm font-medium mb-2 text-gray-300">First Name</label>
                <input
                  type="text"
                  required
                  value={registerForm.firstName}
                  onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-white placeholder-gray-500"
                  placeholder="Ahmad"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium mb-2 text-gray-300">Last Name</label>
                <input
                  type="text"
                  required
                  value={registerForm.lastName}
                  onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-white placeholder-gray-500"
                  placeholder="Abdullah"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
              <input
                type="email"
                required
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-white placeholder-gray-500"
                placeholder="ahmad@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-yellow-500 via-red-500 to-red-600 rounded-xl font-semibold text-lg hover:scale-105 transition-all hover:shadow-2xl hover:shadow-yellow-500/50"
            >
              Register Now
            </button>
            <p className="text-sm text-gray-400 text-center">
              By registering, you agree to receive updates about Visit Malaysia 2026
            </p>
          </form>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="min-h-screen relative flex items-center justify-center py-20 overflow-hidden section-animate-slide-up-blur"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-float" style={{ top: '20%', right: '10%' }}></div>
          <div className="absolute w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float-delayed" style={{ bottom: '20%', left: '10%' }}></div>
        </div>

        <div className={`max-w-2xl mx-auto px-6 z-10 w-full transition-all duration-1000 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h2>
            <p className="text-xl text-gray-300">Have questions about visiting Malaysia? We're here to help!</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-6 bg-white/5 backdrop-blur-lg p-8 md:p-12 rounded-3xl border border-white/10 hover:border-red-500/50 transition-all">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="block text-sm font-medium mb-2 text-gray-300">First Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.firstName}
                  onChange={(e) => setContactForm({...contactForm, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-white placeholder-gray-500"
                  placeholder="Your first name"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium mb-2 text-gray-300">Last Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.lastName}
                  onChange={(e) => setContactForm({...contactForm, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-white placeholder-gray-500"
                  placeholder="Your last name"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-white placeholder-gray-500"
                placeholder="your.email@example.com"
              />
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium mb-2 text-gray-300">Your Message</label>
              <textarea
                required
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-white placeholder-gray-500 resize-none"
                placeholder="Tell us how we can help you plan your Malaysian adventure..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-red-500 to-yellow-500 rounded-xl font-semibold text-lg hover:scale-105 transition-all hover:shadow-2xl hover:shadow-red-500/50"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 bg-black/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-blue-600 bg-clip-text text-transparent mb-4">
                Visit Malaysia 2026
              </h3>
              <p className="text-gray-400 mb-4">
                Experience the magic of Malaysia - where diverse cultures, stunning landscapes, and warm hospitality create unforgettable memories.
              </p>
              <p className="text-gray-500 text-sm">
                © 2026 Visit Malaysia. All rights reserved.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-yellow-400">Quick Links</h4>
              <div className="space-y-2">
                <a href="#hero" className="block text-gray-400 hover:text-yellow-400 transition-colors">Home</a>
                <a href="#about" className="block text-gray-400 hover:text-yellow-400 transition-colors">About Malaysia</a>
                <a href="#attractions" className="block text-gray-400 hover:text-yellow-400 transition-colors">Attractions</a>
                <a href="#experiences" className="block text-gray-400 hover:text-yellow-400 transition-colors">Experiences</a>
                <a href="#register" className="block text-gray-400 hover:text-yellow-400 transition-colors">Register</a>
                <a href="#contact" className="block text-gray-400 hover:text-yellow-400 transition-colors">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-yellow-400">Follow Us</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-r hover:from-yellow-500 hover:to-red-500 transition-all text-sm">
                  FB
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-r hover:from-yellow-500 hover:to-red-500 transition-all text-sm">
                  IG
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-r hover:from-yellow-500 hover:to-red-500 transition-all text-sm">
                  TW
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-r hover:from-yellow-500 hover:to-red-500 transition-all text-sm">
                  YT
                </a>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                #VisitMalaysia2026<br/>
                #TrulyAsia
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-gray-400">
            <p className="mb-2">🇲🇾 Truly Asia, Truly Unforgettable 🇲🇾</p>
            <p className="text-sm">Discover the heart of Southeast Asia</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* Hide default cursor */
        * {
          cursor: none !important;
        }

        /* AGGRESSIVE CUSTOM CURSOR - EXPLOSIVE DRAGON */
        .cursor-dot {
          position: fixed;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, #fff 0%, #facc15 50%, #ef4444 100%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          box-shadow:
            0 0 30px #facc15,
            0 0 60px #facc15,
            0 0 90px #f59e0b,
            0 0 120px #ef4444,
            inset 0 0 20px #fff;
          animation: cursor-pulse 1.5s ease-in-out infinite;
        }

        @keyframes cursor-pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 30px #facc15, 0 0 60px #facc15, 0 0 90px #f59e0b, 0 0 120px #ef4444;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3);
            box-shadow: 0 0 50px #facc15, 0 0 100px #facc15, 0 0 150px #f59e0b, 0 0 200px #ef4444;
          }
        }

        .cursor-glow {
          position: fixed;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, rgba(250, 204, 21, 0.6) 0%, rgba(245, 158, 11, 0.4) 40%, rgba(239, 68, 68, 0.2) 70%, transparent 100%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
          transition: transform 0.05s ease-out;
          animation: glow-pulse 2s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); filter: blur(15px); }
          50% { transform: translate(-50%, -50%) scale(1.4); filter: blur(25px); }
        }

        .cursor-glow-large {
          position: fixed;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle,
            rgba(250, 204, 21, 0.25) 0%,
            rgba(239, 68, 68, 0.15) 40%,
            rgba(59, 130, 246, 0.1) 70%,
            transparent 100%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9997;
          transform: translate(-50%, -50%);
          transition: transform 0.2s ease-out;
          filter: blur(40px);
          animation: mega-glow 3s ease-in-out infinite;
        }

        @keyframes mega-glow {
          0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          50% { transform: translate(-50%, -50%) scale(1.5) rotate(180deg); }
        }

        /* EXPLOSIVE DRAGON TAIL */
        .cursor-trail {
          position: fixed;
          background: radial-gradient(circle,
            rgba(250, 204, 21, 1) 0%,
            rgba(245, 158, 11, 0.8) 20%,
            rgba(239, 68, 68, 0.6) 40%,
            rgba(147, 51, 234, 0.3) 70%,
            transparent 100%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9996;
          transform: translate(-50%, -50%);
          transition: opacity 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out;
          filter: blur(2px);
          box-shadow:
            0 0 25px rgba(250, 204, 21, 0.8),
            0 0 50px rgba(239, 68, 68, 0.5);
          animation: trail-shimmer 0.8s ease-in-out infinite;
        }

        @keyframes trail-shimmer {
          0%, 100% { filter: blur(2px) brightness(1); }
          50% { filter: blur(4px) brightness(1.5); }
        }

        /* ===== ULTRA AGGRESSIVE SCROLL ANIMATIONS ===== */

        section[class*="section-animate"] {
          transition: all 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          opacity: 1 !important;
          will-change: transform, filter, opacity;
          min-height: 100vh; /* Ensure sections take full viewport */
        }

        /* Ensure all sections remain visible - prevent disappearing */
        section[class*="section-animate"].section-visible {
          visibility: visible !important;
          opacity: 1 !important;
        }

        section[class*="section-animate"].section-hidden {
          visibility: visible !important; /* Keep visible even when "hidden" */
          opacity: 1 !important;
        }

        /* === HERO - MASSIVE EXPLOSIVE ZOOM === */
        .section-animate-hero.section-hidden {
          transform: scale(0.4) rotate(-15deg) translateY(200px);
          filter: blur(30px) brightness(0.3) saturate(0.3);
        }
        .section-animate-hero.section-visible {
          transform: scale(1) rotate(0deg) translateY(0);
          filter: blur(0) brightness(1) saturate(1);
          animation: hero-mega-blast 2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes hero-mega-blast {
          0% {
            transform: scale(0.4) rotate(-15deg) translateY(200px);
            filter: blur(30px) brightness(0.3);
          }
          30% {
            transform: scale(1.25) rotate(8deg) translateY(-50px);
            filter: blur(5px) brightness(1.3);
          }
          50% {
            transform: scale(0.9) rotate(-5deg) translateY(20px);
            filter: blur(2px) brightness(1.1);
          }
          70% {
            transform: scale(1.08) rotate(2deg) translateY(-10px);
            filter: blur(0) brightness(1.05);
          }
          100% {
            transform: scale(1) rotate(0deg) translateY(0);
            filter: blur(0) brightness(1);
          }
        }

        /* === ABOUT - SPINNING TORNADO ENTRANCE === */
        .section-animate-slide-left.section-hidden {
          transform: translateX(-200%) rotateY(-90deg) rotateZ(-45deg) scale(0.5);
          transform-style: preserve-3d;
          perspective: 2000px;
          filter: blur(30px) brightness(0.3) contrast(0.5);
        }
        .section-animate-slide-left.section-visible {
          transform: translateX(0) rotateY(0deg) rotateZ(0deg) scale(1);
          filter: blur(0) brightness(1) contrast(1);
          animation: tornado-spin 2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes tornado-spin {
          0% {
            transform: translateX(-200%) rotateY(-90deg) rotateZ(-45deg) scale(0.5);
            filter: blur(30px);
          }
          40% {
            transform: translateX(50px) rotateY(15deg) rotateZ(10deg) scale(1.15);
            filter: blur(8px);
          }
          65% {
            transform: translateX(-20px) rotateY(-8deg) rotateZ(-5deg) scale(0.95);
            filter: blur(2px);
          }
          85% {
            transform: translateX(10px) rotateY(3deg) rotateZ(2deg) scale(1.03);
            filter: blur(0);
          }
          100% {
            transform: translateX(0) rotateY(0deg) rotateZ(0deg) scale(1);
            filter: blur(0);
          }
        }

        /* === ATTRACTIONS - EXPLOSIVE 3D FLIP === */
        .section-animate-flip.section-hidden {
          transform: perspective(2500px) rotateX(-90deg) rotateY(45deg) rotateZ(25deg) translateY(300px) scale(0.3);
          transform-style: preserve-3d;
          filter: blur(40px) saturate(0.3) brightness(0.2) contrast(0.5);
        }
        .section-animate-flip.section-visible {
          transform: perspective(2500px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateY(0) scale(1);
          filter: blur(0) saturate(1) brightness(1) contrast(1);
          animation: mega-flip-explosion 2.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes mega-flip-explosion {
          0% {
            transform: perspective(2500px) rotateX(-90deg) rotateY(45deg) rotateZ(25deg) translateY(300px) scale(0.3);
            filter: blur(40px) brightness(0.2);
          }
          25% {
            transform: perspective(2500px) rotateX(45deg) rotateY(-20deg) rotateZ(-15deg) translateY(-80px) scale(1.3);
            filter: blur(15px) brightness(1.4);
          }
          50% {
            transform: perspective(2500px) rotateX(-15deg) rotateY(10deg) rotateZ(8deg) translateY(40px) scale(0.85);
            filter: blur(5px) brightness(1.1);
          }
          75% {
            transform: perspective(2500px) rotateX(8deg) rotateY(-5deg) rotateZ(-3deg) translateY(-15px) scale(1.08);
            filter: blur(1px) brightness(1.05);
          }
          100% {
            transform: perspective(2500px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateY(0) scale(1);
            filter: blur(0) brightness(1);
          }
        }

        /* === EXPERIENCES - WILD CAROUSEL BLAST === */
        .section-animate-slide-right.section-hidden {
          transform: translateX(250%) rotateY(90deg) rotateZ(60deg) scale(0.4);
          transform-style: preserve-3d;
          perspective: 2500px;
          filter: blur(35px) contrast(0.3) brightness(0.3) saturate(0.3);
        }
        .section-animate-slide-right.section-visible {
          transform: translateX(0) rotateY(0deg) rotateZ(0deg) scale(1);
          filter: blur(0) contrast(1) brightness(1) saturate(1);
          animation: wild-carousel 2.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes wild-carousel {
          0% {
            transform: translateX(250%) rotateY(90deg) rotateZ(60deg) scale(0.4);
            filter: blur(35px);
          }
          30% {
            transform: translateX(-80px) rotateY(-30deg) rotateZ(-20deg) scale(1.25);
            filter: blur(12px);
          }
          55% {
            transform: translateX(40px) rotateY(15deg) rotateZ(10deg) scale(0.9);
            filter: blur(4px);
          }
          80% {
            transform: translateX(-15px) rotateY(-5deg) rotateZ(-3deg) scale(1.05);
            filter: blur(1px);
          }
          100% {
            transform: translateX(0) rotateY(0deg) rotateZ(0deg) scale(1);
            filter: blur(0);
          }
        }

        /* === REGISTER - INSANE SPIRAL EXPLOSION === */
        .section-animate-scale.section-hidden {
          transform: scale(0.2) rotate(180deg) translateY(400px) skew(-20deg, 20deg);
          filter: blur(50px) brightness(0.2) hue-rotate(180deg);
        }
        .section-animate-scale.section-visible {
          transform: scale(1) rotate(0deg) translateY(0) skew(0deg, 0deg);
          filter: blur(0) brightness(1) hue-rotate(0deg);
          animation: spiral-explosion 2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes spiral-explosion {
          0% {
            transform: scale(0.2) rotate(180deg) translateY(400px) skew(-20deg, 20deg);
            filter: blur(50px) brightness(0.2) hue-rotate(180deg);
          }
          25% {
            transform: scale(1.4) rotate(-40deg) translateY(-100px) skew(10deg, -10deg);
            filter: blur(20px) brightness(1.5) hue-rotate(-45deg);
          }
          50% {
            transform: scale(0.8) rotate(20deg) translateY(50px) skew(-5deg, 5deg);
            filter: blur(8px) brightness(1.2) hue-rotate(20deg);
          }
          75% {
            transform: scale(1.12) rotate(-10deg) translateY(-25px) skew(2deg, -2deg);
            filter: blur(2px) brightness(1.05) hue-rotate(-10deg);
          }
          100% {
            transform: scale(1) rotate(0deg) translateY(0) skew(0deg, 0deg);
            filter: blur(0) brightness(1) hue-rotate(0deg);
          }
        }

        /* === CONTACT - MASSIVE EARTHQUAKE RISE === */
        .section-animate-slide-up-blur.section-hidden {
          transform: translateY(500px) scale(0.3) rotateX(90deg) rotateZ(-30deg);
          filter: blur(60px) contrast(0.2) brightness(0.2) saturate(0.2);
          transform-style: preserve-3d;
          perspective: 2000px;
        }
        .section-animate-slide-up-blur.section-visible {
          transform: translateY(0) scale(1) rotateX(0deg) rotateZ(0deg);
          filter: blur(0) contrast(1) brightness(1) saturate(1);
          animation: earthquake-rise 2.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes earthquake-rise {
          0% {
            transform: translateY(500px) scale(0.3) rotateX(90deg) rotateZ(-30deg);
            filter: blur(60px) brightness(0.2);
          }
          20% {
            transform: translateY(-100px) scale(1.3) rotateX(-20deg) rotateZ(15deg);
            filter: blur(25px) brightness(1.4);
          }
          40% {
            transform: translateY(60px) scale(0.85) rotateX(15deg) rotateZ(-10deg);
            filter: blur(10px) brightness(1.2);
          }
          60% {
            transform: translateY(-30px) scale(1.1) rotateX(-8deg) rotateZ(5deg);
            filter: blur(4px) brightness(1.1);
          }
          80% {
            transform: translateY(15px) scale(0.95) rotateX(4deg) rotateZ(-2deg);
            filter: blur(1px) brightness(1.05);
          }
          100% {
            transform: translateY(0) scale(1) rotateX(0deg) rotateZ(0deg);
            filter: blur(0) brightness(1);
          }
        }

        /* === ULTRA AGGRESSIVE STAGGER === */
        .stagger-item {
          transition: all 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          will-change: transform, filter;
        }

        .stagger-item.stagger-hidden {
          transform: translateY(150px) scale(0.5) rotateX(45deg) rotateZ(25deg);
          filter: blur(20px) brightness(0.3) saturate(0.5);
          opacity: 0.3;
        }

        .stagger-item.stagger-visible {
          transform: translateY(0) scale(1) rotateX(0deg) rotateZ(0deg);
          filter: blur(0) brightness(1) saturate(1);
          opacity: 1;
          animation: stagger-blast 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes stagger-blast {
          0% {
            transform: translateY(150px) scale(0.5) rotateX(45deg) rotateZ(25deg);
            filter: blur(20px);
          }
          40% {
            transform: translateY(-30px) scale(1.2) rotateX(-10deg) rotateZ(-8deg);
            filter: blur(5px);
          }
          70% {
            transform: translateY(10px) scale(0.95) rotateX(5deg) rotateZ(3deg);
            filter: blur(1px);
          }
          100% {
            transform: translateY(0) scale(1) rotateX(0deg) rotateZ(0deg);
            filter: blur(0);
          }
        }

        .stagger-item.stagger-visible:hover {
          transform: translateY(-30px) scale(1.15) rotateX(-8deg) rotateZ(-5deg);
          filter: brightness(1.4) saturate(1.3) drop-shadow(0 25px 50px rgba(250, 204, 21, 0.6));
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        /* ===== EXPLOSIVE BACKGROUND ANIMATIONS ===== */

        @keyframes gradient {
          0% { background-position: 0% 50%; transform: scale(1) rotate(0deg); }
          25% { background-position: 100% 50%; transform: scale(1.2) rotate(90deg); }
          50% { background-position: 100% 50%; transform: scale(1) rotate(180deg); }
          75% { background-position: 0% 50%; transform: scale(1.2) rotate(270deg); }
          100% { background-position: 0% 50%; transform: scale(1) rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          25% { transform: translate(60px, -60px) scale(1.3) rotate(90deg); }
          50% { transform: translate(30px, 30px) scale(0.8) rotate(180deg); }
          75% { transform: translate(-60px, 60px) scale(1.3) rotate(270deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          25% { transform: translate(-70px, 70px) scale(1.4) rotate(-90deg); }
          50% { transform: translate(40px, -40px) scale(0.7) rotate(-180deg); }
          75% { transform: translate(70px, -70px) scale(1.4) rotate(-270deg); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(50px, 50px) scale(1.25) rotate(120deg); }
          66% { transform: translate(-50px, 50px) scale(1.25) rotate(240deg); }
        }

        /* AGGRESSIVE TEXT ANIMATIONS */
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100px) scale(0.7) rotate(10deg);
            filter: blur(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
            filter: blur(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(80px) scale(0.8) skew(-5deg, -5deg);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1) skew(0deg, 0deg);
            filter: blur(0);
          }
        }

        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 6s ease infinite;
        }

        .animate-float {
          animation: float 15s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 18s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-slide-up-delayed {
          animation: slide-up 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s both;
        }

        .animate-slide-up-more-delayed {
          animation: slide-up 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s both;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
        }

        /* MEGA HOVER EFFECTS */
        a:hover, button:hover {
          transform: scale(1.15) translateY(-8px) rotate(2deg) !important;
          filter: drop-shadow(0 20px 40px rgba(250, 204, 21, 0.6)) brightness(1.3) !important;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
        }

        /* AGGRESSIVE FORM FOCUS */
        input:focus, textarea:focus {
          transform: scale(1.05) translateY(-4px) !important;
          box-shadow: 0 15px 50px rgba(250, 204, 21, 0.5), 0 0 0 4px rgba(250, 204, 21, 0.3) !important;
          filter: brightness(1.2) !important;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
        }

        html {
          scroll-behavior: smooth;
          scroll-padding-top: 80px; /* Account for fixed navbar */
        }

        section {
          transform-style: preserve-3d;
          position: relative;
          z-index: 1;
        }

        /* Ensure sections are always visible once shown */
        section[id] {
          scroll-margin-top: 80px; /* Additional margin for anchor links */
        }

        /* SCREEN SHAKE ON SECTION VISIBLE */
        @keyframes screen-shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .section-visible {
          animation: screen-shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

