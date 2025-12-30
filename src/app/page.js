import HomePage from "@/containers/HomePage";
import Script from "next/script";

export default async function Page() {
  return (
    <>
      <Script
        id="webtour-patch"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Simpan referensi original querySelector
            const originalQuerySelector = Document.prototype.querySelector;
            console.log("Testing Andrew VT :",originalQuerySelector);
            // Override querySelector
            Document.prototype.querySelector = function(selector) {
              // Jika selector mengandung bg-[#002C84], ganti dengan selector yang valid
              if (selector.includes('bg-[#002C84]')) {
                selector = 'header a.text-neutral-50.rounded-3xl';
              }
              return originalQuerySelector.call(this, selector);
            };
          `
        }}
      />
      <Script
        src="https://webtour.muatmuat.com/launcher?key=30efcf1cc8c08034a2375161ecf85a9b435659c7&play=0&user=abcdef1234567890"
        strategy="afterInteractive"
      />
      <HomePage categories={[]} />
    </>
  )
}
