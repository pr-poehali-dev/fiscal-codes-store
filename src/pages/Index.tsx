import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  period: string;
  image: string;
  features: string[];
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Яндекс ОФД',
    description: 'Надёжный оператор от Яндекса с быстрой активацией',
    price: 3000,
    period: '12 месяцев',
    image: 'https://cdn.poehali.dev/projects/5b12a502-f4f3-4621-a36d-627dc871679c/files/c59ecfd1-354f-4607-a9e0-28f6ba79625e.jpg',
    features: ['Мгновенная активация', 'Техподдержка 24/7', 'Защита данных']
  },
  {
    id: 2,
    name: 'СБИС ОФД',
    description: 'Проверенное решение для малого и среднего бизнеса',
    price: 2500,
    period: '12 месяцев',
    image: 'https://cdn.poehali.dev/projects/5b12a502-f4f3-4621-a36d-627dc871679c/files/5eb323be-f595-4996-9ea1-e2e148729617.jpg',
    features: ['Быстрая настройка', 'Онлайн-кабинет', 'Гарантия работы']
  },
  {
    id: 3,
    name: 'Первый ОФД',
    description: 'Первый оператор на рынке с богатым опытом',
    price: 2800,
    period: '12 месяцев',
    image: 'https://cdn.poehali.dev/projects/5b12a502-f4f3-4621-a36d-627dc871679c/files/18a3cf46-14a1-4883-9a30-9c9b1aab66dc.jpg',
    features: ['Опыт с 2017 года', 'Стабильная работа', 'Низкая цена']
  },
  {
    id: 4,
    name: 'Такском ОФД',
    description: 'Современное решение для онлайн-бизнеса',
    price: 3200,
    period: '12 месяцев',
    image: 'https://cdn.poehali.dev/projects/5b12a502-f4f3-4621-a36d-627dc871679c/files/62d3b84b-a3f4-47f0-80f9-e46c87c1db4e.jpg',
    features: ['API интеграция', 'Мобильное приложение', 'Аналитика']
  },
  {
    id: 5,
    name: 'Контур ОФД',
    description: 'Надёжность от группы компаний СКБ Контур',
    price: 2900,
    period: '12 месяцев',
    image: 'https://cdn.poehali.dev/projects/5b12a502-f4f3-4621-a36d-627dc871679c/files/9c9b72f5-0d37-427e-afae-6e3cd5bfd3b4.jpg',
    features: ['Интеграция с 1С', 'Простота настройки', 'Личный кабинет']
  },
  {
    id: 6,
    name: 'Астрал ОФД',
    description: 'Полный спектр услуг для вашего бизнеса',
    price: 2700,
    period: '12 месяцев',
    image: 'https://cdn.poehali.dev/projects/5b12a502-f4f3-4621-a36d-627dc871679c/files/1c2c74ec-21b1-4f53-a14f-0b01b5ceb8e7.jpg',
    features: ['Консультации', 'Помощь в настройке', 'Выгодная цена']
  }
];

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeSection, setActiveSection] = useState<'home' | 'catalog' | 'faq' | 'contacts' | 'admin'>('home');

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart(prevCart => [...prevCart, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.name} добавлен в корзину`);
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast.info('Товар удалён из корзины');
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const orderData = {
      customer_name: formData.get('name'),
      customer_email: formData.get('email'),
      customer_phone: formData.get('phone'),
      items: cart,
      total_amount: getTotalPrice()
    };

    try {
      const response = await fetch('https://functions.poehali.dev/a1cd03de-8b38-4bf3-812a-92647f7fd451', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        toast.success('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.');
        setCart([]);
        e.currentTarget.reset();
      } else {
        toast.error('Ошибка при оформлении заказа');
      }
    } catch (error) {
      toast.error('Ошибка соединения с сервером');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-md">
                <Icon name="Receipt" className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">ОФД Коды</h1>
                <p className="text-xs text-muted-foreground">Коды активации для вашего бизнеса</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" onClick={() => setActiveSection('home')}>Главная</Button>
              <Button variant="ghost" onClick={() => setActiveSection('catalog')}>Каталог</Button>
              <Button variant="ghost" onClick={() => setActiveSection('faq')}>FAQ</Button>
              <Button variant="ghost" onClick={() => setActiveSection('contacts')}>Контакты</Button>
              <Button variant="ghost" onClick={() => setActiveSection('admin')}>Админ</Button>
            </nav>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-green-600">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Корзина покупок</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                              <div className="flex-1">
                                <h4 className="font-semibold">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Icon name="Minus" size={14} />
                                  </Button>
                                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Icon name="Plus" size={14} />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-7 w-7 ml-auto text-destructive"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Icon name="Trash2" size={14} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold mb-4">
                          <span>Итого:</span>
                          <span>{getTotalPrice()} ₽</span>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-green-600 hover:bg-green-700">
                              Оформить заказ
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Оформление заказа</DialogTitle>
                              <DialogDescription>Заполните данные для получения кодов активации</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCheckout} className="space-y-4">
                              <div>
                                <Label htmlFor="name">Имя *</Label>
                                <Input id="name" name="name" required placeholder="Иван Иванов" />
                              </div>
                              <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input id="email" name="email" type="email" required placeholder="ivan@example.com" />
                              </div>
                              <div>
                                <Label htmlFor="phone">Телефон *</Label>
                                <Input id="phone" name="phone" required placeholder="+7 900 123-45-67" />
                              </div>
                              <div className="bg-muted p-3 rounded">
                                <p className="text-sm font-medium mb-1">Ваш заказ:</p>
                                {cart.map(item => (
                                  <p key={item.id} className="text-sm text-muted-foreground">
                                    {item.name} × {item.quantity} = {item.price * item.quantity} ₽
                                  </p>
                                ))}
                                <p className="text-sm font-bold mt-2 pt-2 border-t">Итого: {getTotalPrice()} ₽</p>
                              </div>
                              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                                Подтвердить заказ
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'home' && <HomeSection setActiveSection={setActiveSection} />}
        {activeSection === 'catalog' && <CatalogSection products={products} addToCart={addToCart} />}
        {activeSection === 'faq' && <FAQSection />}
        {activeSection === 'contacts' && <ContactsSection />}
        {activeSection === 'admin' && <AdminSection />}
      </main>

      <footer className="bg-green-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 ОФД Коды. Все права защищены.</p>
          <p className="text-xs text-green-300 mt-2">Официальный дилер операторов фискальных данных</p>
        </div>
      </footer>
    </div>
  );
};

const HomeSection = ({ setActiveSection }: { setActiveSection: (section: 'home' | 'catalog' | 'faq' | 'contacts' | 'admin') => void }) => (
  <div className="space-y-12">
    <section className="text-center py-12">
      <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
        <Icon name="Sparkles" size={16} />
        <span>Надёжные коды активации для вашего бизнеса</span>
      </div>
      <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
        Коды активации ОФД
      </h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        Быстрая активация, официальные операторы, техподдержка 24/7
      </p>
      <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => setActiveSection('catalog')}>
        Посмотреть каталог
        <Icon name="ArrowRight" className="ml-2" size={16} />
      </Button>
    </section>

    <section className="grid md:grid-cols-3 gap-6">
      <Card className="border-green-200">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="Zap" className="text-green-600" size={24} />
          </div>
          <h3 className="font-bold mb-2">Мгновенная активация</h3>
          <p className="text-sm text-muted-foreground">Получите коды сразу после оплаты</p>
        </CardContent>
      </Card>
      <Card className="border-green-200">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" className="text-green-600" size={24} />
          </div>
          <h3 className="font-bold mb-2">Официальные операторы</h3>
          <p className="text-sm text-muted-foreground">Работаем только с аккредитованными ОФД</p>
        </CardContent>
      </Card>
      <Card className="border-green-200">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="HeadphonesIcon" className="text-green-600" size={24} />
          </div>
          <h3 className="font-bold mb-2">Поддержка 24/7</h3>
          <p className="text-sm text-muted-foreground">Всегда готовы помочь с настройкой</p>
        </CardContent>
      </Card>
    </section>
  </div>
);

const CatalogSection = ({ products, addToCart }: { products: Product[], addToCart: (product: Product) => void }) => (
  <div className="space-y-6">
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-4">Каталог операторов</h2>
      <p className="text-muted-foreground">Выберите подходящего оператора фискальных данных</p>
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">{product.price} ₽</span>
                <Badge variant="outline">{product.period}</Badge>
              </div>
              <ul className="space-y-1">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="text-sm flex items-center gap-2">
                    <Icon name="Check" size={14} className="text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => addToCart(product)}>
                <Icon name="ShoppingCart" size={16} className="mr-2" />
                В корзину
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const FAQSection = () => (
  <div className="max-w-3xl mx-auto space-y-6">
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-4">Частые вопросы</h2>
      <p className="text-muted-foreground">Ответы на популярные вопросы о кодах активации</p>
    </div>
    
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Как быстро я получу код активации?</AccordionTrigger>
        <AccordionContent>
          Коды активации отправляются автоматически на ваш email сразу после подтверждения оплаты. Обычно это занимает не более 5 минут.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-2">
        <AccordionTrigger>Какой ОФД выбрать?</AccordionTrigger>
        <AccordionContent>
          Все представленные операторы официально аккредитованы ФНС. Выбор зависит от ваших потребностей: интеграции с 1С, наличия мобильного приложения, цены. Мы рекомендуем ознакомиться с особенностями каждого оператора в каталоге.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-3">
        <AccordionTrigger>Можно ли получить помощь с настройкой?</AccordionTrigger>
        <AccordionContent>
          Да, наша техподдержка работает 24/7. После покупки вы получите инструкцию по активации, а также контакты нашей поддержки для консультаций.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-4">
        <AccordionTrigger>Что делать, если код не подошёл?</AccordionTrigger>
        <AccordionContent>
          Все коды проверяются перед отправкой. Если возникли проблемы с активацией, свяжитесь с нашей поддержкой, и мы оперативно решим вопрос или предложим замену.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-5">
        <AccordionTrigger>Какие способы оплаты доступны?</AccordionTrigger>
        <AccordionContent>
          Принимаем оплату банковскими картами, через СБП, и по безналичному расчёту для юридических лиц. После оформления заказа с вами свяжется менеджер для согласования удобного способа оплаты.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

const ContactsSection = () => (
  <div className="max-w-2xl mx-auto space-y-6">
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-4">Контакты</h2>
      <p className="text-muted-foreground">Свяжитесь с нами любым удобным способом</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Phone" className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Телефон</h3>
              <p className="text-muted-foreground">+7 (800) 555-35-35</p>
              <p className="text-sm text-muted-foreground mt-1">Звонок по России бесплатный</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Mail" className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-muted-foreground">info@ofd-codes.ru</p>
              <p className="text-sm text-muted-foreground mt-1">Ответим в течение 1 часа</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="MessageCircle" className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Telegram</h3>
              <p className="text-muted-foreground">@ofdcodes_support</p>
              <p className="text-sm text-muted-foreground mt-1">Быстрая поддержка в мессенджере</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Clock" className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Режим работы</h3>
              <p className="text-muted-foreground">Круглосуточно, 24/7</p>
              <p className="text-sm text-muted-foreground mt-1">Без выходных и праздников</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const AdminSection = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/a1cd03de-8b38-4bf3-812a-92647f7fd451');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error('Ошибка загрузки заказов');
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    loadOrders();
  });

  if (loading) {
    return <div className="text-center py-8">Загрузка заказов...</div>;
  }

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Заказов пока нет</p>
      ) : (
        orders.map(order => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Заказ #{order.id}</CardTitle>
                  <CardDescription>
                    {new Date(order.created_at).toLocaleString('ru-RU')}
                  </CardDescription>
                </div>
                <Badge>{order.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Клиент:</strong> {order.customer_name}</p>
                <p><strong>Email:</strong> {order.customer_email}</p>
                <p><strong>Телефон:</strong> {order.customer_phone}</p>
                <p><strong>Сумма:</strong> {order.total_amount} ₽</p>
                <div>
                  <strong>Товары:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {order.items.map((item: any, idx: number) => (
                      <li key={idx}>{item.name} × {item.quantity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Index;
