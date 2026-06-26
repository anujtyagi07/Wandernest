import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, ChevronDown, Send, ArrowUpRight, Camera, Globe, MessageCircle, CheckCircle } from 'lucide-react';
import { contactService } from '../services/contactService';

/* ---- Animation Variants ---- */
const reveal = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

/* ---- Data ---- */
const contactInfo = [
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', sub: 'Mon-Sat, 9AM-7PM' },
  { icon: Mail, label: 'Email', value: 'hello@wandernest.in', sub: 'We reply within 24 hours' },
  { icon: MapPin, label: 'Office', value: 'Rishikesh, Uttarakhand', sub: 'India 249201' },
  { icon: Clock, label: 'Working Hours', value: 'Mon - Sat: 9AM - 7PM', sub: 'Sunday: Closed' },
];

const faqs = [
  { q: 'How do I book a tour package?', a: 'Browse our packages page, select your preferred tour, and click "Book Now". Fill in your traveler details, choose your travel date, and confirm your booking. Our team will reach out within 24 hours to finalize everything and answer any questions.' },
  { q: 'What is the cancellation policy?', a: 'Free cancellation up to 7 days before the travel date with full refund. Between 3-7 days, a 25% cancellation fee applies. Within 3 days of travel, the booking is non-refundable but can be rescheduled for a future date. For Chardham Yatra packages during peak season (May-June), special cancellation terms apply.' },
  { q: 'Are meals included in the package?', a: 'Yes, all our packages include breakfast, lunch, and dinner unless specifically mentioned otherwise. We cater to all dietary preferences including vegetarian, vegan, Jain, and special medical dietary requirements. Just let us know your preferences at the time of booking.' },
  { q: 'Can I customize a tour package?', a: 'Absolutely! We specialize in tailor-made itineraries. Contact us with your requirements — preferred destinations, travel dates, group size, budget, and any special interests. Our travel experts will create a personalized package just for you. Custom packages often offer better value for groups of 4 or more.' },
  { q: 'Is travel insurance included?', a: 'Yes, basic travel insurance covering medical emergencies, trip cancellation, and lost baggage is included in all our packages. Premium insurance upgrades covering adventure activities (rafting, trekking, paragliding) are available for an additional ₹1,500 per person.' },
  { q: 'What should I pack for Chardham Yatra?', a: 'Essential items include warm clothing (temperatures drop significantly at high altitude), comfortable walking shoes, rain gear, sunscreen, personal medication, valid ID proof, and a small backpack for day treks. We provide a detailed packing list with your booking confirmation.' },
];

const socials = [
  { icon: Camera, label: 'Instagram', href: '#' },
  { icon: Globe, label: 'Facebook', href: '#' },
  { icon: MessageCircle, label: 'Twitter', href: '#' },
];

const Contact = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Match server Zod validation: name min 2, email valid, subject min 3, message min 10
    if (!formData.name || formData.name.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.subject || formData.subject.length < 3) {
      setError('Subject must be at least 3 characters');
      return;
    }
    if (!formData.message || formData.message.length < 10) {
      setError('Message must be at least 10 characters');
      return;
    }
    setSubmitting(true);
    try {
      await contactService.submit(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      // Show field-specific errors from server validation if available
      const serverErrors = err.errors || err.response?.data?.errors;
      if (serverErrors && typeof serverErrors === 'object') {
        const firstField = Object.keys(serverErrors)[0];
        setError(serverErrors[firstField] || err.message || 'Failed to send message.');
      } else {
        setError(err.message || 'Failed to send message. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-24 bg-surface-dim relative overflow-hidden min-h-screen" ref={heroRef}>
      <div className="absolute inset-0 grain pointer-events-none z-0" />
      <div className="absolute top-40 right-[10%] w-[500px] h-[500px] rounded-full bg-primary-100/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 left-[5%] w-[400px] h-[400px] rounded-full bg-accent-100/15 blur-[100px] pointer-events-none" />

      <motion.div style={{ opacity: heroOpacity }} className="container-custom relative z-10">
        {/* Hero */}
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="pt-8 mb-16"
        >
          <motion.div variants={reveal} className="flex items-center gap-3 mb-6">
            <motion.div animate={{ width: [0, 48] }} transition={{ duration: 0.8, delay: 0.3 }} className="h-[2px] bg-primary-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">Reach Out</span>
          </motion.div>

          <motion.h1 variants={reveal} className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-heading leading-[0.95] mb-6">
            Get in <span className="italic font-normal text-gradient-warm">touch</span>
          </motion.h1>

          <motion.p variants={reveal} className="text-gray-400 text-lg max-w-xl leading-relaxed font-light">
            Have questions about our tours? Need help planning your trip? We'd love to hear from you.
          </motion.p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16"
        >
          {contactInfo.map((info) => (
            <motion.div
              key={info.label}
              variants={reveal}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary-200 transition-all duration-500"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center mb-5 group-hover:from-primary-100 group-hover:to-accent-100 transition-all duration-500"
              >
                <info.icon className="w-6 h-6 text-primary-600" />
              </motion.div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{info.label}</p>
              <p className="font-heading font-bold text-heading mb-1">{info.value}</p>
              <p className="text-xs text-gray-400">{info.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Form + Map */}
        <div className="grid lg:grid-cols-2 gap-10 mb-20">
          {/* Contact Form */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
            variants={reveal}
            className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-[2px] bg-primary-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">Message Us</span>
            </div>
            <h2 className="text-3xl font-heading font-bold text-heading mb-8">
              Send us a <span className="italic font-normal">message</span>
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {submitted && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <p className="text-emerald-700 text-sm">Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Name', type: 'text', placeholder: 'Your name', field: 'name' },
                  { label: 'Email', type: 'email', placeholder: 'your@email.com', field: 'email' },
                ].map((field) => (
                  <motion.div
                    key={field.label}
                    whileFocus={{ scale: 1.01 }}
                    className="group"
                  >
                    <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.field]}
                      onChange={(e) => setFormData({ ...formData, [field.field]: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white outline-none transition-all duration-300 text-sm"
                    />
                  </motion.div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Subject <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white outline-none transition-all duration-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Message <span className="text-red-400">*</span></label>
                <textarea
                  rows="5"
                  placeholder="Tell us more about your travel plans..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:bg-white outline-none transition-all duration-300 resize-none text-sm"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="group w-full py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300 disabled:opacity-60"
              >
                {submitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                    <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Map + Social */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
            variants={reveal}
            className="space-y-6"
          >
            <div className="relative h-72 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2B3A52] via-secondary-900 to-secondary-700" />
              <img
                src="https://images.unsplash.com/photo-1701358736212-6593deb47fc3?w=800&h=400&fit=crop"
                alt="Rishikesh"
                className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.1]">
                <MapPin className="w-32 h-32 text-white" />
              </div>
              <div className="absolute bottom-6 left-6">
                <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-1">Visit Us</p>
                <p className="text-white font-heading text-xl font-bold">Rishikesh, Uttarakhand</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100">
              <h3 className="font-heading font-bold text-xl text-heading mb-2">Follow Us</h3>
              <p className="text-sm text-gray-400 mb-6">Stay updated with our latest packages and travel stories.</p>
              <div className="flex flex-wrap gap-3">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-500 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-all duration-300"
                  >
                    <s.icon className="w-4 h-4" />
                    {s.label}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={reveal} className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-500 mb-4">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-heading">
              Frequently <span className="italic font-normal text-gradient-warm">asked</span>
            </h2>
          </motion.div>

          <motion.div variants={reveal} className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${
                  openFaq === i ? 'border-primary-200 shadow-lg' : 'border-gray-100'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-heading font-semibold text-heading pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 transition-colors ${openFaq === i ? 'text-primary-500' : 'text-gray-300'}`} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;
