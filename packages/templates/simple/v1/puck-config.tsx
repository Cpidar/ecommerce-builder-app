import { Config } from '@measured/puck'
import { PuckProps } from '../puck-types'

// Import blocks (complex sections/layouts)
import {
  HeaderBlock,
  HeadingBlock,
  HeroSection,
  LandingHeroSection,
  ProductGrid,
  FeaturedProductsSection,
  FeatureCard,
  NewsletterSection,
  FooterSection,
} from '@repo/ui/blocks'

// Import components (simple reusable elements)
import { TextBlock } from '@repo/ui/components/TextBlock'
import { ButtonBlock } from '@repo/ui/components/ButtonBlock'
import { Spacer } from '@repo/ui/components/Spacer'
import { Logo } from '@repo/ui/components/Logo'
import { StatItem } from '@repo/ui/components/StatItem'
import { Badge } from '@repo/ui/components/Badge'
import { AuthProvider } from '@/contexts/auth-context'

export const config: Config<PuckProps> = {
  root: {
    fields: {
      title: { type: 'text' },
      description: { type: 'textarea' },
      handle: { type: 'text' },
    },
    render: ({ children }) => {
      return (
        <div className="twp">
          <AuthProvider>{children}</AuthProvider>
        </div>
      )
    },
  },
  categories: {
    layout: {
      title: '🏗️ Sections',
      components: ['HeaderBlock', 'FooterSection', 'HeroSection', 'LandingHeroSection'],
    },
    content: {
      title: '📝 Blocks',
      components: [
        'HeadingBlock',
        'NewsletterSection',
        'ProductGrid',
        'FeaturedProductsSection',
        'FeatureCard',
      ],
    },
    elements: {
      title: '🔧 Components',
      components: ['TextBlock', 'ButtonBlock', 'Logo', 'StatItem', 'Badge', 'Spacer'],
    },
  },
  components: {
    // Layout Blocks
    HeaderBlock,
    FooterSection,
    HeroSection,
    LandingHeroSection,
    // Content Blocks
    HeadingBlock,
    NewsletterSection,
    ProductGrid,
    FeaturedProductsSection,
    FeatureCard,
    // Components
    TextBlock,
    ButtonBlock,
    Logo,
    StatItem,
    Badge,
    Spacer,
  },
}
