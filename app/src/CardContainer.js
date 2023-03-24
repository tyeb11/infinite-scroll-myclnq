import { Card, Image, Center, CardFooter, Text } from "@chakra-ui/react";
function CardContainer({ name, poster_image, index }) {
  return (
    <Card key={index}>
      <Image
        objectFit="cover"
        src={`./img/${poster_image}`}
        title={poster_image}
      />
      <Center>
        <CardFooter>
          <Text fontSize={20}>{name}</Text>
        </CardFooter>
      </Center>
    </Card>
  );
}

export default CardContainer;
