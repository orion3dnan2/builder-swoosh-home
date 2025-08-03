import { useEffect, useState } from "react";
import { useProducts } from "@/lib/products";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";

export default function DebugProducts() {
  const { id } = useParams();
  const { products: allProducts } = useProducts();
  const [localStorageData, setLocalStorageData] = useState<any>(null);
  const [storesData, setStoresData] = useState<any>(null);

  useEffect(() => {
    // Get localStorage data
    const productsStr = localStorage.getItem("bayt_al_sudani_products");
    setLocalStorageData(productsStr ? JSON.parse(productsStr) : null);

    // Get stores data
    fetch("/api/stores")
      .then((res) => res.json())
      .then((data) => setStoresData(data))
      .catch((err) => console.error("Error fetching stores:", err));
  }, []);

  const restaurantProducts = allProducts.filter(
    (product) => product.storeId === id && product.status === "active",
  );

  const currentStore = storesData?.find((store: any) => store.id === id);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="arabic">تشخيص المنتجات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-bold arabic">معرف المطعم الحالي:</h3>
              <p className="font-mono text-sm">{id}</p>
            </div>

            <div>
              <h3 className="font-bold arabic">معلومات المطعم:</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(currentStore, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-bold arabic">
                إجمالي المنتجات في useProducts:
              </h3>
              <p>{allProducts.length} منتج</p>
            </div>

            <div>
              <h3 className="font-bold arabic">منتجات المطعم المفلترة:</h3>
              <p>{restaurantProducts.length} منتج</p>
            </div>

            <div>
              <h3 className="font-bold arabic">
                جميع المنتجات في useProducts:
              </h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-60">
                {JSON.stringify(
                  allProducts.map((p) => ({
                    id: p.id,
                    name: p.name,
                    storeId: p.storeId,
                    status: p.status,
                  })),
                  null,
                  2,
                )}
              </pre>
            </div>

            <div>
              <h3 className="font-bold arabic">البيانات في localStorage:</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-60">
                {JSON.stringify(
                  localStorageData?.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    storeId: p.storeId,
                    status: p.status,
                  })),
                  null,
                  2,
                )}
              </pre>
            </div>

            <div>
              <h3 className="font-bold arabic">جميع المتاجر:</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-60">
                {JSON.stringify(
                  storesData?.map((s: any) => ({
                    id: s.id,
                    merchantId: s.merchantId,
                    name: s.name,
                    storeType: s.storeType,
                  })),
                  null,
                  2,
                )}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
