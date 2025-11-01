import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
    image: 'https://cdn.poehali.dev/projects/5b12a502-f4f3-4621-a36d-627dc871679c/files/e7497863-0a97-4b4c-a521-7c8f6da1158d.jpg',
    features: ['Проверенный опыт', 'Стабильная работа', 'Консультации']
  },
  {
    id: 4,
    name: 'Контур ОФД',
    description: 'Интеграция с популярными бухгалтерскими системами',
    price: 3200,
    period: '12 месяцев',
    image: 'https://cdn.poehali.dev/projects/5b12a502-f4f3-4621-a36d-627dc871679c/files/c59ecfd1-354f-4607-a9e0-28f6ba79625e.jpg',
    features: ['Интеграция с 1С', 'Автоматизация', 'API доступ']
  },
  {
    id: 5,
    name: 'Такском ОФД',
    description: 'Доступные цены и качественный сервис',
    price: 2300,
    period: '12 месяцев',
    image: 'https://cdn.poehali.dev/projects/5b12a502-f4f3-4621-a36d-627dc871679c/files/5eb323be-f595-4996-9ea1-e2e148729617.jpg',
    features: ['Выгодная цена', 'Простота подключения', 'Надёжность']
  },
  {
    id: 6,
    name: 'Платформа ОФД',
    description: 'Современное решение для любого бизнеса',
    price: 2700,
    period: '12 месяцев',
    image: 'https://cdn.poehali.dev/projects/5b12a502-f4f3-4621-a36d-627dc871679c/files/e7497863-0a97-4b4c-a521-7c8f6da1158d.jpg',
    features: ['Современный интерфейс', 'Мобильное приложение', 'Аналитика']
  }
];

const faqItems = [
  {
    question: 'Что такое код активации ОФД?',
    answer: 'Код активации ОФД — это уникальный ключ для подключения вашей кассы к оператору фискальных данных. После покупки вы получаете код, который вводится в настройках кассы для передачи чеков в налоговую.'
  },
  {
    question: 'Как быстро приходит код после оплаты?',
    answer: 'Код активации отправляется автоматически на вашу электронную почту в течение 5 минут после подтверждения оплаты. Проверьте папку "Спам", если письмо не пришло.'
  },
  {
    question: 'Можно ли продлить код активации?',
    answer: 'Да, вы можете продлить код за 2 недели до окончания срока действия. Мы пришлём вам напоминание на email. Просто оформите новый заказ, используя тот же email.'
  },
  {
    question: 'Какие способы оплаты доступны?',
    answer: 'Мы принимаем оплату банковскими картами (Visa, Mastercard, МИР), через СБП, электронные кошельки и безналичный расчёт для юридических лиц.'
  },
  {
    question: 'Что делать, если код не подходит?',
    answer: 'Свяжитесь с нашей технической поддержкой по телефону +7 (800) 555-35-35 или напишите на support@fiscal-codes.ru. Мы решим проблему в течение 1 часа.'
  }
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} добавлен в корзину`);
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
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
        toast.success('Заказ успешно оформлен! Код придёт на email');
        setCart([]);
        setIsCheckoutOpen(false);
        e.currentTarget.reset();
      }
    } catch (error) {
      toast.error('Ошибка при оформлении заказа');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Receipt" size={32} className="text-primary" />
            <h1 className="text-2xl font-bold text-foreground">ФискалКод</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => setActiveTab('home')} className="text-foreground hover:text-primary transition-colors">
              Главная
            </button>
            <button onClick={() => setActiveTab('catalog')} className="text-foreground hover:text-primary transition-colors">
              Каталог
            </button>
            <button onClick={() => setActiveTab('faq')} className="text-foreground hover:text-primary transition-colors">
              FAQ
            </button>
            <button onClick={() => setActiveTab('contacts')} className="text-foreground hover:text-primary transition-colors">
              Контакты
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Корзина пустая</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{item.name}</h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Icon name="X" size={16} />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{item.period}</p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Icon name="Minus" size={14} />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Icon name="Plus" size={14} />
                                </Button>
                              </div>
                              <p className="font-bold">{item.price * item.quantity} ₽</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-bold text-lg">Итого:</span>
                          <span className="font-bold text-xl text-primary">{getTotalPrice()} ₽</span>
                        </div>
                        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                          <DialogTrigger asChild>
                            <Button className="w-full" size="lg">
                              Оформить заказ
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Оформление заказа</DialogTitle>
                              <DialogDescription>
                                Заполните данные для получения кодов активации
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCheckout} className="space-y-4">
                              <div>
                                <Label htmlFor="name">Имя</Label>
                                <Input id="name" name="name" required placeholder="Иван Иванов" />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" required placeholder="ivan@example.com" />
                              </div>
                              <div>
                                <Label htmlFor="phone">Телефон</Label>
                                <Input id="phone" name="phone" required placeholder="+7 (900) 123-45-67" />
                              </div>
                              <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm font-medium mb-2">Ваш заказ:</p>
                                {cart.map(item => (
                                  <div key={item.id} className="flex justify-between text-sm mb-1">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>{item.price * item.quantity} ₽</span>
                                  </div>
                                ))}
                                <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                                  <span>Итого:</span>
                                  <span>{getTotalPrice()} ₽</span>
                                </div>
                              </div>
                              <Button type="submit" className="w-full" size="lg">
                                Оплатить {getTotalPrice()} ₽
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

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Icon name="Lock" size={16} className="mr-2" />
                  Админ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Админ-панель</DialogTitle>
                  <DialogDescription>Управление заказами</DialogDescription>
                </DialogHeader>
                <AdminPanel />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-12">
            <section className="text-center py-12 animate-fade-in">
              <h2 className="text-5xl font-bold mb-4 text-foreground">
                Коды активации ОФД
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Быстрая активация онлайн-касс для вашего бизнеса. Все операторы фискальных данных в одном месте
              </p>
              <Button size="lg" className="mr-4" onClick={() => setActiveTab('catalog')}>
                <Icon name="ShoppingBag" size={20} className="mr-2" />
                Выбрать оператора
              </Button>
              <Button size="lg" variant="outline" onClick={() => setActiveTab('faq')}>
                Узнать больше
              </Button>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              <Card className="hover-scale">
                <CardHeader>
                  <Icon name="Zap" size={40} className="text-primary mb-2" />
                  <CardTitle>Мгновенная активация</CardTitle>
                  <CardDescription>
                    Получите код на email в течение 5 минут после оплаты
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover-scale">
                <CardHeader>
                  <Icon name="Shield" size={40} className="text-primary mb-2" />
                  <CardTitle>Безопасная оплата</CardTitle>
                  <CardDescription>
                    Все платежи защищены современными технологиями шифрования
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover-scale">
                <CardHeader>
                  <Icon name="Headphones" size={40} className="text-primary mb-2" />
                  <CardTitle>Поддержка 24/7</CardTitle>
                  <CardDescription>
                    Наша команда всегда готова помочь с любыми вопросами
                  </CardDescription>
                </CardHeader>
              </Card>
            </section>

            <section>
              <h3 className="text-3xl font-bold mb-6 text-center">Популярные операторы</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {products.slice(0, 3).map(product => (
                  <Card key={product.id} className="hover-scale overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <CardHeader>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {product.features.map(feature => (
                          <div key={feature} className="flex items-center gap-2 text-sm">
                            <Icon name="Check" size={16} className="text-primary" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-2xl font-bold text-primary">{product.price} ₽</p>
                          <p className="text-sm text-muted-foreground">{product.period}</p>
                        </div>
                        <Button onClick={() => addToCart(product)}>
                          <Icon name="ShoppingCart" size={16} className="mr-2" />
                          В корзину
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold mb-8 text-center">Каталог операторов</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {products.map(product => (
                <Card key={product.id} className="hover-scale overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {product.features.map(feature => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <Icon name="Check" size={16} className="text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">{product.price} ₽</p>
                        <p className="text-sm text-muted-foreground">{product.period}</p>
                      </div>
                      <Button onClick={() => addToCart(product)}>
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        В корзину
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="animate-fade-in max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Частые вопросы</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Контакты</h2>
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <Icon name="Phone" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Телефон</h3>
                    <p className="text-muted-foreground">+7 (800) 555-35-35</p>
                    <p className="text-sm text-muted-foreground">Бесплатно по России</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Icon name="Mail" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <p className="text-muted-foreground">support@fiscal-codes.ru</p>
                    <p className="text-sm text-muted-foreground">Ответим в течение часа</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Icon name="MapPin" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Адрес</h3>
                    <p className="text-muted-foreground">г. Москва, ул. Примерная, д. 123</p>
                    <p className="text-sm text-muted-foreground">Офис работает Пн-Пт 9:00-18:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Icon name="Clock" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Режим работы</h3>
                    <p className="text-muted-foreground">Онлайн-продажи: круглосуточно</p>
                    <p className="text-muted-foreground">Поддержка: 24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="bg-card border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 ФискалКод. Все права защищены.</p>
          <p className="text-sm mt-2">Лицензированная продажа кодов активации ОФД</p>
        </div>
      </footer>
    </div>
  );
}

function AdminPanel() {
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
                      <li key={idx}>{item.name} x{item.quantity} — {item.price * item.quantity} ₽</li>
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
}