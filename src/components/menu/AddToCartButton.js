import FlyingButton from 'react-flying-item';

export default function AddToCartButton({
    hasSizesOrExtras, onClick, basePrice, image
}) {
    if (!hasSizesOrExtras) {
        return (
            <div className="flying-button-parent mt-4">
                <FlyingButton
                    className="mt-4 bg-primary hover:bg-yellow-600 text-white border-none rounded-full px-8 py-2"
                    targetTop={'5%'}
                    targetLeft={'95%'}
                    src={image}
                    onClick={onClick}
                >
                    Add to cart Rp. {basePrice}
                </FlyingButton>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className="mt-4 bg-primary hover:bg-yellow-600 text-white border-none rounded-full px-8 py-2"
        >
            <span>Add to cart Rp. {basePrice}</span>
        </button>
    );
}