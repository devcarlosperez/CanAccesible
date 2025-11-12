import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const BlogSlider = ({ articles }) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-sm"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="p-0 overflow-hidden">
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    <img 
                      src={`https://via.placeholder.com/300?text=Article+${index + 1}`} 
                      alt={`Article ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-2">
                      Título del Artículo {index + 1}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default BlogSlider;