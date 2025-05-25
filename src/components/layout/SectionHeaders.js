export default function SectionHeaders({subHeader,mainHeader}) {
  return (
    <>
      <h3 className="uppercase text-gray-500 font-bold leading-4 font-serif">
        {subHeader}
      </h3>
      <h2 className="text-yellow-500 font-bold text-4xl font-agbalumo">
        {mainHeader}
      </h2>
    </>
  );
}