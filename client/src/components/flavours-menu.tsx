import { Card, CardContent } from "@/components/ui/card";

export default function FlavoursMenu() {
  const standardFlavours = [
    { name: "Double Apple", emoji: "🍎" },
    { name: "Lemon Mint", emoji: "🍋" },
    { name: "Grape", emoji: "🍇" },
    { name: "Blueberry", emoji: "🫐" },
    { name: "Mango", emoji: "🥭" },
    { name: "Lady Killer", emoji: "🌿" }
  ];

  const premiumFlavours = [
    { name: "Chauffeur Special", description: "(Blue Dragon + Lady Killer)", emoji: "🌟" },
    { name: "Blue Mist", description: "(Blueberry + Mint)", emoji: "🔵" },
    { name: "Royal Paan Breeze", description: "(Paan + mint)", emoji: "🍃" },
    { name: "Summer Sunset", description: "(Mango + Peach + Lemon)", emoji: "🍑🥭" },
    { name: "Raspberry Mojito", description: "(Raspberry + mint + lime)", emoji: "🍓🌿" }
  ];

  return (
    <section id="flavours" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">FLAVOURS MENU</h2>
          <p className="text-xl text-muted-foreground">Discover our premium selection of shisha flavours</p>
        </div>

        {/* Standard Flavours */}
        <div className="mb-16">
          <h3 className="font-serif text-3xl font-semibold text-center mb-12 border-b border-primary pb-4">
            Standard Flavours
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {standardFlavours.map((flavour, index) => (
              <Card key={index} className="bg-card text-center hover-float gradient-purple" data-testid={`standard-flavour-${index}`}>
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{flavour.emoji}</div>
                  <h4 className="font-semibold text-lg mb-2">{flavour.name}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium Flavours */}
        <div>
          <h3 className="font-serif text-3xl font-semibold text-center mb-12 border-b border-primary pb-4">
            Premium Flavours
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumFlavours.map((flavour, index) => (
              <Card key={index} className="bg-card hover-float gradient-purple" data-testid={`premium-flavour-${index}`}>
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-4xl mb-4">{flavour.emoji}</div>
                    <h4 className="font-serif text-xl font-semibold mb-3">{flavour.name}</h4>
                    <p className="text-sm text-gray-300">{flavour.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
